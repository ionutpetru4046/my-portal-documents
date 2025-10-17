"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiUser, FiMail, FiLock, FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProfilePage() {
  const { user, setUser } = useUser(); 
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // NEW: document and notification states
  const [docCount, setDocCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState([]);

  useEffect(() => {
    async function fetchDocumentStats() {
      if (!user?.id) return;
      // fetch doc metadata from Supabase
      const { data, error } = await supabase
        .from("documents")
        .select("id,name,expiration_date,reminder_at,userID")
        .eq("userID", user.id);
      if (error) return;
      setDocCount(data.length);
      let count = 0;
      const notifs = [];
      for (const doc of data) {
        const expiresIn = daysUntil(doc.expiration_date);
        const reminderIn = daysUntil(doc.reminder_at);
        if (doc.expiration_date && expiresIn !== null && expiresIn <= 7 && expiresIn >= 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: 'expiring', info: `Expiring in ${expiresIn}d` });
        }
        if (doc.expiration_date && expiresIn !== null && expiresIn < 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: 'expired', info: `Expired ${-expiresIn}d ago` });
        }
        if (doc.reminder_at && reminderIn !== null && reminderIn <= 1 && reminderIn >= 0) {
          count++;
          notifs.push({ id: doc.id, name: doc.name, type: 'reminder', info: `Reminder due in ${reminderIn}d` });
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

  const handleUpdateProfile = () => {
    setUser({ ...user, ...formData });
    setEditMode(false);
    toast.success("Profile updated!");
  };

  const handleDeleteUser = () => {
    alert("User deleted!");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, avatar: fileUrl });
    }
  };

  const handleStatChange = (id: number, field: "value" | "note", newValue: string) => {
    const updatedStats = stats.map(stat =>
      stat.id === id ? { ...stat, [field]: field === "value" ? Number(newValue) : newValue } : stat
    );
    setStats(updatedStats);
    localStorage.setItem("myportal-stats", JSON.stringify(updatedStats));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Toaster position="top-right" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-b-3xl mb-10 shadow-xl text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold">Welcome, {user.name} 👋</h1>
            <p className="mt-2 text-gray-200 text-lg">Manage your profile and stats interactively.</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Info */}
            <Card className="shadow-lg hover:shadow-2xl transition duration-300 p-6 rounded-3xl bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold mb-4">Profile Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition"
                    onClick={handleAvatarClick}
                  >
                    Change Avatar
                  </Button>
                </div>
                {/* Editable Fields */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled={!editMode}
                      onChange={handleChange}
                      className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 ${
                        editMode ? "border-indigo-400 bg-white" : "border-gray-300 bg-gray-100"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={!editMode}
                      onChange={handleChange}
                      className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 ${
                        editMode ? "border-indigo-400 bg-white" : "border-gray-300 bg-gray-100"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  {editMode ? (
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 flex items-center gap-2"
                      onClick={handleUpdateProfile}
                    >
                      <FiCheckCircle /> Save
                    </Button>
                  ) : (
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center gap-2"
                      onClick={() => setEditMode(true)}
                    >
                      <FiEdit /> Edit
                    </Button>
                  )}
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 flex items-center gap-2"
                    onClick={handleDeleteUser}
                  >
                    <FiTrash2 /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats: real doc count, real notifications, hardcoded activity (optional) */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg hover:shadow-2xl transition duration-300 p-4 rounded-3xl bg-white border-t-4" style={{ borderTopColor: `var(--tw-blue-500)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <FiFileText className="w-7 h-7 text-blue-500" />
                  <CardTitle className="text-md font-semibold">Documents</CardTitle>
                </div>
                <CardContent className="flex flex-col gap-2">
                  <input
                    type="number"
                    value={docCount}
                    readOnly
                    className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-800 font-bold"
                  />
                  <span className="text-xs text-gray-500">Total uploaded docs</span>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-2xl transition duration-300 p-4 rounded-3xl bg-white border-t-4" style={{ borderTopColor: `var(--tw-yellow-400)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <FiBell className="w-7 h-7 text-yellow-400" />
                  <CardTitle className="text-md font-semibold">Notifications</CardTitle>
                </div>
                <CardContent className="flex flex-col gap-2">
                  <input
                    type="number"
                    value={notifCount}
                    readOnly
                    className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-800 font-bold"
                  />
                  <span className="text-xs text-gray-500">Reminders & Expirations</span>
                  {/* Show notification details here */}
                  {notifList.length > 0 && (
                    <ul className="text-xs mt-2 space-y-1">
                      {notifList.map(n => (
                        <li key={n.id + n.type} className="flex gap-1 items-center">
                          <span className={n.type === 'expiring' ? 'text-red-600' : n.type === 'expired' ? 'text-gray-600' : 'text-yellow-700'}>
                            ●</span> <span className="font-semibold">{n.name}</span><span className="ml-2">({n.info})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-2xl transition duration-300 p-4 rounded-3xl bg-white border-t-4" style={{ borderTopColor: `var(--tw-green-500)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <FiActivity className="w-7 h-7 text-green-500" />
                  <CardTitle className="text-md font-semibold">Recent Activity</CardTitle>
                </div>
                <CardContent className="flex flex-col gap-2">
                  <input
                    type="text"
                    value="(coming soon)"
                    readOnly
                    className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-800 font-bold"
                  />
                  <span className="text-xs text-gray-500">Last event (feature coming)</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
