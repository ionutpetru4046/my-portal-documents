"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiUser, FiMail, FiLock, FiEdit, FiTrash2, FiCheckCircle, FiFileText, FiActivity, FiBell } from "react-icons/fi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, setUser } = useUser(); // Use shared context
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stats, setStats] = useState([
    { id: 1, label: "Documents", value: 12, color: "blue-600", note: "" },
    { id: 2, label: "Recent Activity", value: 5, color: "green-600", note: "" },
    { id: 3, label: "Notifications", value: 3, color: "yellow-500", note: "" },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    setUser({ ...user, ...formData });
    setEditMode(false);
    alert("Profile updated!");
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
      setUser({ ...user, avatar: fileUrl }); // Update shared context
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white p-6 rounded-b-3xl mb-8 shadow-lg text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Welcome, {user.name} 👋
        </h1>
        <p className="mt-2 text-gray-100 text-lg">
          Manage your profile and stats interactively.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info */}
        <Card className="shadow-md hover:shadow-xl transition duration-300 p-6">
          <CardHeader>
            <CardTitle className="text-lg mb-4">Profile Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col items-center mb-4">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-white shadow-md object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAvatarClick}
              >
                Change Avatar
              </Button>
            </div>

            {/* Editable Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled={!editMode}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded ${
                    editMode ? "border-blue-400" : "border-gray-300 bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={!editMode}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded ${
                    editMode ? "border-blue-400" : "border-gray-300 bg-gray-100"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              {editMode ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleUpdateProfile}
                >
                  <FiCheckCircle className="inline mr-2" /> Save
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setEditMode(true)}
                >
                  <FiEdit className="inline mr-2" /> Edit
                </Button>
              )}
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteUser}
              >
                <FiTrash2 className="inline mr-2" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Editable Stats Cards */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(stat => (
            <Card
              key={stat.id}
              className={`shadow-md hover:shadow-xl transition duration-300 p-4 border-t-4 border-${stat.color}`}
            >
              <div className="flex items-center gap-4 mb-2">
                {stat.label === "Documents" && <FiFileText className={`w-8 h-8 text-${stat.color}`} />}
                {stat.label === "Recent Activity" && <FiActivity className={`w-8 h-8 text-${stat.color}`} />}
                {stat.label === "Notifications" && <FiBell className={`w-8 h-8 text-${stat.color}`} />}
                <CardTitle className="text-lg">{stat.label}</CardTitle>
              </div>
              <CardContent>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => handleStatChange(stat.id, "value", e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={stat.note}
                  onChange={(e) => handleStatChange(stat.id, "note", e.target.value)}
                  className="w-full border p-2 rounded text-gray-500"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
