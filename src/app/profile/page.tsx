"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiUser, FiMail, FiLock, FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell, FiEdit2 } from "react-icons/fi";
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
  const [notifList, setNotifList] = useState<Notif[]>([]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-200 via-purple-200 to-indigo-100 text-gray-900">
      <Toaster position="top-right" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 py-8 px-2 sm:px-8 lg:px-16">
          <section className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
            {/* PROFILE CARD */}
            <div className="w-full md:w-2/5 xl:w-1/4 bg-white/40 rounded-3xl p-8 shadow-2xl relative backdrop-blur-xl flex flex-col items-center border border-indigo-200">
              <div className="relative group w-32 h-32 mb-4">
                <img src={user.avatar} alt="Avatar" className="rounded-full border-8 border-white shadow-lg w-full h-full object-cover group-hover:scale-105 transition-transform" style={{ boxShadow: '0 0 32px 2px #c7d2fe' }} />
                <button type="button" className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 border border-indigo-200 shadow-md hover:bg-indigo-100 transition" onClick={handleAvatarClick}>
                  <FiEdit2 className="text-indigo-600 w-6 h-6" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="w-full flex flex-col gap-2 mb-3">
                <label className="block text-xs uppercase text-gray-500 tracking-widest">Name</label>
                <input type="text" name="name" value={formData.name} disabled={!editMode} onChange={handleChange} className={`rounded-xl p-3 text-lg font-semibold shadow-inner bg-white/60 border ${editMode ? 'border-indigo-400 bg-white' : 'border-gray-100 bg-gray-100'} focus:ring-2 focus:ring-indigo-300 transition`} />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="block text-xs uppercase text-gray-500 tracking-widest">Email</label>
                <input type="email" name="email" value={formData.email} disabled={!editMode} onChange={handleChange} className={`rounded-xl p-3 text-lg font-semibold shadow-inner bg-white/60 border ${editMode ? 'border-indigo-400 bg-white' : 'border-gray-100 bg-gray-100'} focus:ring-2 focus:ring-indigo-300 transition`} />
              </div>
              <div className="flex gap-3 mt-6 w-full">
                {editMode ? (
                  <Button className="bg-green-500 hover:bg-green-600 text-white w-full rounded-xl" onClick={handleUpdateProfile}>
                    <FiCheckCircle className="inline mr-1" />Save
                  </Button>
                ) : (
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-xl" onClick={() => setEditMode(true)}>
                    <FiEdit className="inline mr-1" />Edit
                  </Button>
                )}
              </div>
                <Button className="bg-red-500 mt-4 w-full hover:bg-red-600 text-white rounded-xl" onClick={handleDeleteUser}><FiTrash2 className="inline mr-1" />Delete</Button>
            </div>

            {/* DASHBOARD PANEL */}
            <div className="flex-1 flex flex-col gap-9 w-full">
              <div className="bg-white/60 backdrop-blur-2xl shadow-2xl rounded-2xl p-8 flex flex-col sm:flex-row gap-8 md:gap-12 items-stretch border border-indigo-100">
                {/* Stat Cards Modern Overlay */}
                <div className="flex-1 flex flex-col items-center gap-2 justify-center rounded-xl p-4 glass hover:scale-105 transition-transform border border-blue-100">
                  <FiFileText className="text-blue-500 w-8 h-8 mb-2" />
                  <div className="text-3xl font-bold mb-1">{docCount}</div>
                  <div className="uppercase text-xs text-blue-700 tracking-widest">Documents</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 justify-center rounded-xl p-4 glass hover:scale-105 transition-transform border border-yellow-100">
                  <FiBell className="text-yellow-400 w-8 h-8 mb-2 animate-pulse" />
                  <div className="text-3xl font-bold mb-1">{notifCount}</div>
                  <div className="uppercase text-xs text-yellow-600 tracking-widest">Notifications</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 justify-center rounded-xl p-4 glass hover:scale-105 transition-transform border border-green-100">
                  <FiActivity className="text-green-500 w-8 h-8 mb-2" />
                  <div className="text-2xl font-semibold mb-1">(coming soon)</div>
                  <div className="uppercase text-xs text-green-600 tracking-widest">Recent Activity</div>
                </div>
              </div>

              {/* NOTIFICATIONS LIST PANEL */}
              <div className="bg-white/80 backdrop-blur-xl border border-yellow-100 rounded-2xl shadow-md p-6 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <FiBell className="text-yellow-500" />
                  <span className="text-sm font-bold tracking-wide text-yellow-700 uppercase">Your Document Notifications</span>
                </div>
                {notifList.length === 0 && (
                  <div className="text-gray-400 italic">No notifications — all docs are up to date!</div>
                )}
                <ul>
                  {notifList.map(n => (
                    <li key={n.id + n.type} className={`flex gap-2 items-center p-2 rounded-lg my-1 ${n.type === 'expiring' ? 'bg-red-50' : n.type === 'expired' ? 'bg-gray-50' : 'bg-yellow-50'} hover:bg-indigo-50`}>
                      <span className={`font-bold text-lg ${n.type === 'expiring' ? 'text-red-500' : n.type === 'expired' ? 'text-gray-500' : 'text-yellow-700'}`}>●</span>
                      <span className="font-semibold">{n.name}</span>
                      <span className="ml-2 text-xs text-gray-600">({n.info})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
