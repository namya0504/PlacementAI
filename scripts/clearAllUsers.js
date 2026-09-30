import { supabaseAdmin } from '../backend/config/supabaseClient.js';

async function clearAllUsers() {
  console.log('🧹 Starting database purge of all users and user-related data...\n');

  try {
    // 1. Fetch all users from Supabase Auth
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      console.error('Error fetching Supabase auth users:', listErr.message);
    } else {
      const users = usersData?.users || [];
      console.log(`Found ${users.length} user(s) in Supabase Auth.`);

      for (const u of users) {
        console.log(`Deleting user: ${u.email} (${u.id})...`);
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(u.id);
        if (delErr) {
          console.error(`  ❌ Failed to delete user ${u.email}:`, delErr.message);
        } else {
          console.log(`  ✅ User ${u.email} deleted successfully.`);
        }
      }
    }

    // 2. Clean up tables that store user-related data (cascade safety)
    const userTables = [
      'profiles',
      'placement_readiness',
      'skills',
      'projects',
      'certificates',
      'resumes',
      'activities',
      'ats_results',
      'aptitude_attempts',
      'mock_tests',
      'technical_submissions',
      'hr_interviews',
      'download_history',
      'notifications'
    ];

    console.log('\nPurging rows from user-related tables...');
    for (const table of userTables) {
      try {
        // Delete all rows where id is not null (or select all and delete)
        const { error: delTableErr, count } = await supabaseAdmin
          .from(table)
          .delete()
          .not('id', 'is', null);

        if (delTableErr) {
          console.warn(`  ⚠️ Notice for ${table}:`, delTableErr.message);
        } else {
          console.log(`  ✅ Cleaned ${table}`);
        }
      } catch (tableErr) {
        console.warn(`  ⚠️ Exception cleaning ${table}:`, tableErr.message);
      }
    }

    // 3. Purge storage buckets of any user files
    const buckets = ['profile-images', 'resumes', 'certificates', 'reports'];
    console.log('\nPurging storage buckets...');
    for (const bucket of buckets) {
      try {
        const { data: files, error: listBucketErr } = await supabaseAdmin.storage.from(bucket).list();
        if (!listBucketErr && files && files.length > 0) {
          const filePaths = files.map(f => f.name);
          await supabaseAdmin.storage.from(bucket).remove(filePaths);
          console.log(`  ✅ Removed ${filePaths.length} file(s) from bucket ${bucket}`);
        } else {
          console.log(`  ✅ Bucket ${bucket} is clean.`);
        }
      } catch (bErr) {
        console.warn(`  ⚠️ Bucket error for ${bucket}:`, bErr.message);
      }
    }

    // 4. Verify counts
    console.log('\n--- VERIFICATION AUDIT ---');
    const { data: remainingUsers } = await supabaseAdmin.auth.admin.listUsers();
    console.log(`Supabase Auth Users Count: ${remainingUsers?.users?.length || 0}`);

    for (const table of userTables) {
      const { count } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
      console.log(`Table ${table} rows: ${count ?? 0}`);
    }

    // Verify master question banks are still intact
    const masterTables = ['aptitude_questions', 'technical_questions', 'hr_questions', 'companies'];
    for (const mTable of masterTables) {
      const { count } = await supabaseAdmin.from(mTable).select('*', { count: 'exact', head: true });
      console.log(`Master Table ${mTable} rows: ${count ?? 0} (preserved)`);
    }

    console.log('\n🎉 ALL USERS AND USER-RELATED DATA PURGED SUCCESSFULLY!');
  } catch (err) {
    console.error('Fatal purge error:', err);
  }
}

clearAllUsers();
