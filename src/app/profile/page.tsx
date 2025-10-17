"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiUser, FiMail, FiLock, FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  const { user, setUser } = useUser(); 
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stats, setStats] = useState([
    { id: 1, label: "Documents", value: 12, color: "blue-500", note: "" },
    { id: 2, label: "Recent Activity", value: 5, color: "green-500", note: "" },
    { id: 3, label: "Notifications", value: 3, color: "yellow-400", note: "" },
  ]);

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

  useEffect(() => {
    const storedStats = localStorage.getItem("myportal-stats");
    if (storedStats) setStats(JSON.parse(storedStats));
  }, []);
  
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

            {/* Stats */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map(stat => (
                <Card key={stat.id} className="shadow-lg hover:shadow-2xl transition duration-300 p-4 rounded-3xl bg-white border-t-4" style={{ borderTopColor: `var(--tw-${stat.color})` }}>
                  <div className="flex items-center gap-3 mb-3">
                    {stat.label === "Documents" && <FiFileText className={`w-7 h-7 text-${stat.color}`} />}
                    {stat.label === "Recent Activity" && <FiActivity className={`w-7 h-7 text-${stat.color}`} />}
                    {stat.label === "Notifications" && <FiBell className={`w-7 h-7 text-${stat.color}`} />}
                    <CardTitle className="text-md font-semibold">{stat.label}</CardTitle>
                  </div>
                  <CardContent className="flex flex-col gap-2">
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(stat.id, "value", e.target.value)}
                      className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      placeholder="Add a note..."
                      value={stat.note}
                      onChange={(e) => handleStatChange(stat.id, "note", e.target.value)}
                      className="w-full border p-2 rounded-xl text-gray-500 focus:ring-2 focus:ring-indigo-400"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
