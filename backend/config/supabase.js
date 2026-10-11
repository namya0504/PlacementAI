import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabase = null;

try {
  if (config.supabase.url && config.supabase.serviceRoleKey) {
    supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Storage client initialized successfully');
  } else {
    console.warn('⚠️ Supabase credentials not found in env. File uploads will not work.');
  }
} catch (error) {
  console.error('❌ Supabase initialization failed:', error.message);
}

export { supabase };
