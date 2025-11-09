"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell, FiUpload, FiTrendingUp, FiCalendar, FiClock, FiAlertCircle, FiX, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";

interface Notif {
  id: string;
  name: string;
  type: "expiring" | "expired" | "reminder";
  info: string;
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [docCount, setDocCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState<Notif[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
  };

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  useEffect(() => {
    async function fetchDocumentStats() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("documents")
        .select("id,name,expiration_date,reminder_at,userID,created_at")
        .eq("userID", user.id)
        .order("created_at", { ascending: false });
      
      if (error) return;

      setDocCount(data.length);
      setRecentDocs(data.slice(0, 3));

      let count = 0;
      const notifs: Notif[] = [];

      for (const doc of data) {
        const expiresIn = daysUntil(doc.expiration_date);
        const reminderIn = daysUntil(doc.reminder_at);

        if (doc.expiration_date && expiresIn !== null && expiresIn <= 7 && expiresIn >= 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: "expiring", info: `Expiring in ${expiresIn}d` });
        }
        if (doc.expiration_date && expiresIn !== null && expiresIn < 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: "expired", info: `Expired ${-expiresIn}d ago` });
        }
        if (doc.reminder_at && reminderIn !== null && reminderIn <= 1 && reminderIn >= 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: "reminder", info: `Reminder due in ${reminderIn}d` });
        }
      }

      setNotifCount(count);
      setNotifList(notifs);
    }

    fetchDocumentStats();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: { name: formData.name },
    });

    if (error) {
      toast.error("Failed to update profile");
      return;
    }

    setUser({ ...user, ...formData });
    setEditMode(false);
    toast.success("Profile updated!");
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });

    if (uploadError) return toast.error("Failed to upload avatar");

    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar: publicUrl },
    });

    if (updateError) return toast.error("Failed to update avatar");

    setUser({ ...user, avatar: publicUrl });
    toast.success("Avatar updated!");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '8px',
          background: isDark ? '#1e293b' : '#f8fafc',
          color: isDark ? '#f1f5f9' : '#1e293b',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
        },
      }} />
      
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your profile and preferences</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-200 border border-slate-300 dark:border-slate-700"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <FiMoon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-200 border border-slate-300 dark:border-slate-700"
              >
                <FiBell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {notifCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300">
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifList.length > 0 ? (
                      notifList.map(n => (
                        <div key={n.id + n.type} className="p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              n.type === 'expiring' ? 'bg-red-500' : 
                              n.type === 'expired' ? 'bg-slate-400 dark:bg-slate-500' : 'bg-yellow-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm">{n.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.info}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <FiBell className="w-12 h-12 mx-auto mb-2 text-slate-400 dark:text-slate-700" />
                        <p className="text-slate-600 dark:text-slate-400 text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <Reveal animation="fade-up">
            <div className="lg:col-span-1">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600"></div>
                <div className="p-6 relative">
                  <div className="flex flex-col items-center -mt-16 mb-6">
                    <div className="relative group mb-4">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt="Avatar"
                        className="w-28 h-28 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-lg object-cover"
                      />
                      <button
                        onClick={handleAvatarClick}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <FiUpload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{user.name || "User"}</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm text-center mt-1">{user.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        disabled={!editMode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 rounded-lg border transition-all text-sm ${
                          editMode 
                            ? "border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" 
                            : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    {editMode ? (
                      <>
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg py-2.5 font-medium transition-colors"
                          onClick={handleUpdateProfile}
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2 inline" /> Save
                        </Button>
                        <Button 
                          className="px-4 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-300 rounded-lg text-sm transition-colors"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg py-2.5 font-medium transition-colors"
                        onClick={() => setEditMode(true)}
                      >
                        <FiEdit className="w-4 h-4 mr-2 inline" /> Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <FiActivity className="w-4 h-4" />
                  Activity Log
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <FiLogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </Reveal>

          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <Reveal animation="fade-up" delay={40}>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Documents</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{docCount}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FiFileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Alerts</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{notifCount}</h3>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notifCount > 0 ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <FiAlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Recent</p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{recentDocs.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <FiActivity className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Recent Documents */}
            <Reveal animation="fade-up" delay={80}>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center text-sm">
                    <FiFileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Recent Documents
                  </h3>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentDocs.length > 0 ? (
                    recentDocs.map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Added {formatDate(doc.created_at)}</p>
                            </div>
                          </div>
                          {doc.expiration_date && (
                            <div className="text-right shrink-0">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Expires</p>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(doc.expiration_date)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <FiFileText className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm">No documents yet</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Danger Zone */}
            <Reveal animation="fade-up" delay={120}>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-red-300 dark:border-red-900/50 overflow-hidden transition-colors duration-300">
                <div className="px-6 py-4 border-b border-red-300 dark:border-red-900/50 bg-red-100 dark:bg-red-500/10">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center text-sm">
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Danger Zone
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">Delete Account</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Permanently delete your account and all associated data</p>
                    </div>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg px-4 py-2.5 font-medium transition-colors shrink-0"
                      onClick={() => {
                        if (confirm("Are you sure? This cannot be undone.")) {
                          toast.error("Account deletion will be implemented");
                        }
                      }}
                    >
                      <FiTrash2 className="w-4 h-4 mr-2 inline" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}