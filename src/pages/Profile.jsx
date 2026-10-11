import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Edit3, CheckCircle, Menu, Upload, X, Save, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

export default function Profile() {
  const { currentUser, updateProfileData } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || 'Software Developer',
    photoURL: currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'Student')}`,
    phone: '',
    location: '',
    college: '',
    branch: '',
    passingYear: '',
    bio: '',
    linkedIn: '',
    github: '',
    skills: []
  });

  useEffect(() => {
    API.getProfile()
      .then(data => {
        if (data) {
          setProfileData(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.warn('Profile fetch notice:', err.message));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Unsupported file format. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5 MB. Please select a smaller image.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setAvatarUploading(true);
      const res = await API.uploadAvatar(formData);
      if (res?.photoURL) {
        setProfileData(prev => ({ ...prev, photoURL: res.photoURL }));
        updateProfileData({ photoURL: res.photoURL });
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert(err.message || 'Avatar upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await API.updateProfile(profileData);
      updateProfileData(updated);
      setIsEditing(false);
    } catch (err) {
      updateProfileData(profileData);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">User Profile</h1>
              <p className="text-xs text-slate-500">Manage your account information and view earned achievements</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Profile Card Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={profileData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`}
                  alt="User Avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`;
                  }}
                  className="w-20 h-20 rounded-full ring-4 ring-blue-500/20 object-cover shadow-md"
                />
                <label className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center ${avatarUploading ? 'opacity-100 cursor-wait' : 'opacity-0 group-hover:opacity-100 cursor-pointer'} transition`}>
                  {avatarUploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={avatarUploading}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">{profileData.name}</h2>
                <p className="text-xs font-semibold text-blue-600">{profileData.email}</p>
                <p className="text-xs text-slate-500">{profileData.role} Candidate</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Achievements Counters */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {currentUser?.stats?.resumesCreated || 0}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Resumes Created</div>
                  <div className="text-[11px] text-slate-400">ATS Approved</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  {currentUser?.stats?.testsCompleted || 0}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Tests Completed</div>
                  <div className="text-[11px] text-slate-400">Quant & Coding</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  {currentUser?.stats?.certificatesEarned || 0}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Certificates Earned</div>
                  <div className="text-[11px] text-slate-400">Verified</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  {currentUser?.stats?.mockInterviews || 0}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mock Interviews</div>
                  <div className="text-[11px] text-slate-400">Completed</div>
                </div>
              </div>

            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">Phone</span>
                <span className="font-bold text-slate-800">{profileData.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">Location</span>
                <span className="font-bold text-slate-800">{profileData.location}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">College</span>
                <span className="font-bold text-slate-800">{profileData.college}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">Branch</span>
                <span className="font-bold text-slate-800">{profileData.branch}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">Passing Year</span>
                <span className="font-bold text-slate-800">{profileData.passingYear}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold block">Target Role</span>
                <span className="font-bold text-slate-800">{profileData.role}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={e => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">College</label>
                  <input
                    type="text"
                    value={profileData.college}
                    onChange={e => setProfileData({ ...profileData, college: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    value={profileData.branch}
                    onChange={e => setProfileData({ ...profileData, branch: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Year</label>
                  <input
                    type="text"
                    value={profileData.passingYear}
                    onChange={e => setProfileData({ ...profileData, passingYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bio</label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

