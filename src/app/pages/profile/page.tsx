"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiEdit, FiCheckCircle, FiFileText, FiActivity, FiBell, FiUpload, FiAlertCircle, FiX, FiMoon, FiSun } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Notif {
  id: string;
  name: string;
  type: "expiring" | "expired" | "reminder";
  info: string;
}

interface RecentDoc {
  id: string;
  name: string;
  created_at: string;
  expiration_date?: string;
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProfilePage() {
  const router = useRouter();
  const { setUser, user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [docCount, setDocCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState<Notif[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Use Supabase auth directly for user info
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  // Fetch user data and handle authentication
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

      if (error || !supabaseUser) {
        router.push("/auth/login");
        return;
      }

      setUserId(supabaseUser.id);
      setUserName(supabaseUser.user_metadata?.name || supabaseUser.email || "User");
      setUserEmail(supabaseUser.email || "");
      setUserAvatar(supabaseUser.user_metadata?.avatar || "");

      // Set user in context
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.name || supabaseUser.email || "User",
        avatar: supabaseUser.user_metadata?.avatar || "",
        role: supabaseUser.user_metadata?.role || "user",
      };
      setUser(userData);

      setLoading(false);
    };

    fetchUserData();
  }, [router, setUser]);

  useEffect(() => {
    if (userId) {
      setFormData({ name: userName, email: userEmail });
    }
  }, [userId, userName, userEmail]);

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
    async function fetchDocumentStats() {
      if (!userId) return;
      const { data, error } = await supabase
        .from("documents")
        .select("id,name,expiration_date,reminder_at,userID,created_at")
        .eq("userID", userId)
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
    if (userId) {
      fetchDocumentStats();
    }
  }, [userId]);

  // Profile update logic
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;
    const { error } = await supabase.auth.updateUser({ data: { name: formData.name } });
    if (error) {
      toast.error("Failed to update profile");
      return;
    }
    setUser?.(user ? { ...user, ...formData } : null);
    setEditMode(false);
    toast.success("Profile updated!");
  };

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !userId) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true });
    if (uploadError) return toast.error(`Failed to upload avatar: ${uploadError.message}`);
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    const { error: updateError } = await supabase.auth.updateUser({ data: { avatar: publicUrl } });
    if (updateError) return toast.error(`Failed to update avatar: ${updateError.message}`);
    setUser?.(user ? { ...user, avatar: publicUrl } : null);
    toast.success("Avatar updated!");
  };

  // --- Styling ---
  // brand gradients
  const glass = "backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 shadow-xl border border-blue-900/20";
  const accent = "bg-linear-to-br from-blue-500 via-purple-500 to-cyan-500";

  // Rendering logic
  if (loading || !userId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden py-0 px-0 bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950">
      {/* Blurred Background Gradients */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        <div className="absolute top-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full bg-linear-to-br from-blue-400 via-cyan-300 to-blue-500 opacity-30 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[330px] h-[340px] rounded-full bg-linear-to-br from-purple-900 via-blue-800 to-indigo-700 opacity-20 blur-3xl animate-pulse-slow" />
      </div>

      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '8px',
          background: isDark ? '#1e293b' : '#f8fafc',
          color: isDark ? '#f1f5f9' : '#1e293b',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
        },
      }} />
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300 pb-2">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">Account Settings</h1>
            <p className="text-slate-200 text-sm mt-1">Modern profile & activity</p>
          </div>
          <button onClick={toggleTheme} className="rounded-lg p-2.5 ml-2 bg-gray-100 dark:bg-slate-800 ring-2 ring-blue-500 ring-opacity-20 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
            {isDark ? <FiSun className="w-5 h-5 text-yellow-300" /> : <FiMoon className="w-5 h-5 text-blue-700" />}
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Avatar & Info Card */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}
            className={`lg:col-span-1 ${glass} rounded-3xl p-0 overflow-hidden`}
          >
            {/* Gradient Band */}
            <div className="h-24 w-full rounded-t-3xl bg-linear-to-r from-blue-600 to-purple-600" />
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-14 pb-2">
              <motion.div whileHover={{ scale: 1.07 }} className="relative mb-4">
                <div onClick={handleAvatarClick} className="relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 shadow-lg cursor-pointer group overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-400">
                  {userAvatar ? (
                    <motion.img src={userAvatar} alt="Avatar" className="w-full h-full object-cover focus:ring-2 focus:ring-blue-400 focus:outline-none" whileHover={{ scale: 1.08 }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold bg-linear-to-br from-blue-500 to-purple-400">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center transition-all duration-300 pointer-events-none">
                    <FiUpload className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 text-center">{userName}</h2>
              <p className="text-slate-500 dark:text-slate-300 text-sm text-center mt-1 ">{userEmail}</p>
            </div>
            {/* Edit Form */}
            <div className="px-6 pb-7">
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">Full Name</label>
                <input type="text" name="name" value={formData.name} disabled={!editMode} onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border transition-all text-sm ${editMode ? "border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"}`}
                />
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 mt-2 uppercase tracking-wide">Email Address</label>
                <input type="email" name="email" value={formData.email} disabled
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm" />
              </div>
              <div className="flex gap-2 mt-7">
                {editMode ? (
                  <>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg py-2.5 font-medium transition-colors"
                      onClick={handleUpdateProfile}><FiCheckCircle className="w-4 h-4 mr-2 inline" /> Save</Button>
                    <Button className="px-4 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-300 rounded-lg text-sm transition-colors"
                      onClick={() => setEditMode(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg py-2.5 font-medium transition-colors"
                    onClick={() => setEditMode(true)}><FiEdit className="w-4 h-4 mr-2 inline" /> Edit Profile</Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Info Panel: Documents & Notifications */}
          <motion.div initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.53, delay: 0.1 }}
            className="lg:col-span-2 grid grid-cols-1 gap-8"
          >
            {/* Document Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className={`${glass} rounded-xl flex flex-col items-center p-7 animate-fade-in-up`}>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-2 text-2xl">
                  <FiFileText />
                </div>
                <span className="text-xs text-slate-400 uppercase font-bold">Documents</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{docCount}</span>
              </div>
              <div className={`${glass} rounded-xl flex flex-col items-center p-7 animate-fade-in-up`}>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-300 mb-2 text-2xl">
                  <FiAlertCircle />
                </div>
                <span className="text-xs text-slate-400 uppercase font-bold">Alerts</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{notifCount}</span>
              </div>
              <div className={`${glass} rounded-xl flex flex-col items-center p-7 animate-fade-in-up`}>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-2 text-2xl">
                  <FiActivity />
                </div>
                <span className="text-xs text-slate-400 uppercase font-bold">Recent</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{recentDocs.length}</span>
              </div>
            </div>

            {/* Notifications dropdown trigger */}
            <div className="mb-8 flex justify-end">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-600 dark:hover:text-cyan-300 px-4 py-2 rounded-lg shadow border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur font-semibold">
                <FiBell className="w-5 h-5" /> Alerts & Reminders
                {notifCount > 0 && <span className="ml-2 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">{notifCount}</span>}
              </motion.button>
            </div>
            {showNotifications && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-4 top-40 z-50 w-full md:w-[32rem] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifList.length > 0 ? (
                    notifList.map(n => (
                      <div key={n.id + n.type} className="p-5 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors last:border-b-0 flex gap-2">
                        <div className={`mt-2 shrink-0 w-2 h-2 rounded-full ${n.type === 'expiring' ? 'bg-red-500' : n.type === 'expired' ? 'bg-slate-400 dark:bg-slate-500' : 'bg-yellow-500'}`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{n.name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{n.info}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <FiBell className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-slate-700" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recent Documents */}
            <div className={`${glass} rounded-2xl pt-6 pb-2 px-6 mb-10`}>
              <div className="flex items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-2">
                <FiFileText className="w-5 h-5 mr-2 text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Recent Documents</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentDocs.length > 0 ? (
                  recentDocs.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {doc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Added {formatDate(doc.created_at)}</p>
                      </div>
                      {doc.expiration_date && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-600 dark:text-slate-400">Expires</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(doc.expiration_date)}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <FiFileText className="w-10 h-10 text-slate-400 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm">No documents yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}