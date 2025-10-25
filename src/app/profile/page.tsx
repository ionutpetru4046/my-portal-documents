"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell, FiUpload, FiTrendingUp, FiCalendar, FiClock, FiAlertCircle, FiX } from "react-icons/fi";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [docCount, setDocCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState<Notif[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);

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
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      }} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 pb-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
          <Reveal animation="fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, {user.name || user.email?.split('@')[0]} 👋
                </h1>
                <p className="text-indigo-100 text-lg">Manage your documents and stay organized</p>
              </div>
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <FiBell className="w-6 h-6 text-white" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-lg">
                      {notifCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 bg-linear-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)}>
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifList.length > 0 ? (
                        notifList.map(n => (
                          <div key={n.id + n.type} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                n.type === 'expiring' ? 'bg-red-500' : 
                                n.type === 'expired' ? 'bg-gray-500' : 'bg-yellow-500'
                              }`}></div>
                              <div>
                                <p className="font-semibold text-gray-900">{n.name}</p>
                                <p className="text-sm text-gray-600">{n.info}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <FiBell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Profile Card */}
          <Reveal animation="fade-up" delay={40}>
            <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
              <div className="bg-linear-to-br from-indigo-500 to-purple-500 h-24"></div>
              <CardContent className="relative pt-0 pb-8 px-6">
                <div className="flex flex-col items-center -mt-16">
                  <div className="relative group">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <button
                      onClick={handleAvatarClick}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <FiUpload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
                  </div>
                  
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name || "User"}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  
                  <div className="w-full mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        disabled={!editMode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          editMode 
                            ? "border-indigo-400 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" 
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full flex gap-3 mt-6">
                    {editMode ? (
                      <>
                        <Button 
                          className="flex-1 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={handleUpdateProfile}
                        >
                          <FiCheckCircle className="mr-2" /> Save Changes
                        </Button>
                        <Button 
                          className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-300"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setEditMode(true)}
                      >
                        <FiEdit className="mr-2" /> Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Reveal animation="fade-up" delay={60}>
                <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="bg-linear-to-br from-blue-500 to-blue-600 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Documents</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{docCount}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
                        <FiFileText className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-blue-100 text-sm">
                      <FiTrendingUp className="mr-1" />
                      <span>All your documents</span>
                    </div>
                  </div>
                </Card>
              </Reveal>

              <Reveal animation="fade-up" delay={80}>
                <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="bg-linear-to-br from-yellow-500 to-orange-500 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">Active Alerts</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{notifCount}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
                        <FiAlertCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-yellow-100 text-sm">
                      <FiClock className="mr-1" />
                      <span>Needs attention</span>
                    </div>
                  </div>
                </Card>
              </Reveal>

              <Reveal animation="fade-up" delay={100}>
                <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="bg-linear-to-br from-green-500 to-emerald-600 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">This Month</p>
                        <h3 className="text-4xl font-bold text-white mt-2">{recentDocs.length}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
                        <FiActivity className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-100 text-sm">
                      <FiCalendar className="mr-1" />
                      <span>Recent uploads</span>
                    </div>
                  </div>
                </Card>
              </Reveal>
            </div>

            {/* Recent Documents */}
            <Reveal animation="fade-up" delay={120}>
              <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <FiFileText className="mr-3 text-indigo-600" />
                    Recent Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {recentDocs.length > 0 ? (
                    <div className="space-y-4">
                      {recentDocs.map((doc, idx) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">Added {formatDate(doc.created_at)}</p>
                            </div>
                          </div>
                          {doc.expiration_date && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Expires</p>
                              <p className="text-sm font-semibold text-gray-900">{formatDate(doc.expiration_date)}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents yet</p>
                      <p className="text-sm text-gray-400 mt-2">Upload your first document to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* Danger Zone */}
        <Reveal animation="fade-up" delay={140}>
          <Card className="bg-white rounded-3xl shadow-lg border-2 border-red-200 overflow-hidden mb-6">
            <CardHeader className="bg-red-50 p-6">
              <CardTitle className="text-xl font-bold text-red-600 flex items-center">
                <FiTrash2 className="mr-3" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all associated data</p>
                </div>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      toast.error("Account deletion feature will be implemented");
                    }
                  }}
                >
                  <FiTrash2 className="mr-2" /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}