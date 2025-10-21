"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell } from "react-icons/fi";
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
        .select("id,name,expiration_date,reminder_at,userID")
        .eq("userID", user.id);
      if (error) return;

      setDocCount(data.length);

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

    // Update Supabase metadata
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

    // Upload avatar
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

  if (!user) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-200 via-purple-200 to-indigo-100 text-gray-900">
      <Toaster position="top-right" />
      <main className="flex-1 p-6">
        <Reveal animation="fade-up">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-b-3xl mb-10 shadow-xl text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold">Welcome, {user.name || user.email} 👋</h1>
            <p className="mt-2 text-gray-200 text-lg">Manage your profile and stats interactively.</p>
          </div>
        </Reveal>

        <div className="max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <Reveal animation="fade-up" delay={40}>
            <Card className="shadow-lg hover:shadow-2xl transition duration-300 rounded-3xl bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Profile Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
                  <Button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2" onClick={handleAvatarClick}>
                    Change Avatar
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled={!editMode}
                      onChange={handleChange}
                      className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 ${editMode ? "border-indigo-400 bg-white" : "border-gray-300 bg-gray-100"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 border-gray-300 bg-gray-100"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  {editMode ? (
                    <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 flex items-center gap-2" onClick={handleUpdateProfile}>
                      <FiCheckCircle /> Save
                    </Button>
                  ) : (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center gap-2" onClick={() => setEditMode(true)}>
                      <FiEdit /> Edit
                    </Button>
                  )}
                  <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 flex items-center gap-2" onClick={() => alert("User deleted!")}>
                    <FiTrash2 /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Stats Cards: Documents, Notifications, Activity */}
          {/* ...keep your existing styling exactly */}
        </div>
      </main>
    </div>
  );
}
