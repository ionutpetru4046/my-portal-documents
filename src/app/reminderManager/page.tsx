/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiBell, FiClock, FiAlertCircle, FiCheckCircle, FiX, FiPlus, FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

interface Reminder {
  id: string;
  document_id: string;
  document_name: string;
  expiration_date: string;
  reminder_date: string;
  reminder_type: "email" | "in_app" | "both";
  status: "pending" | "sent" | "expired";
  created_at: string;
  user_id: string;
}

interface ReminderStats {
  total: number;
  pending: number;
  sent: number;
  expired: number;
}

export default function SmartReminderManager() {
  const { user } = useUser();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<ReminderStats>({ total: 0, pending: 0, sent: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    document_name: "",
    expiration_date: "",
    reminder_date: "",
    reminder_type: "both" as "email" | "in_app" | "both",
  });

  useEffect(() => {
    fetchReminders();
  }, [user?.id]);

  const fetchReminders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_date", { ascending: true });

      if (error) {
        console.error("Error fetching reminders:", error);
        toast.error("Failed to load reminders");
        return;
      }

      setReminders(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter((r) => r.status === "pending").length || 0;
      const sent = data?.filter((r) => r.status === "sent").length || 0;
      const expired = data?.filter((r) => r.status === "expired").length || 0;

      setStats({ total, pending, sent, expired });

      // Check and update reminder statuses
      updateReminderStatuses(data || []);
    } catch (err: any) {
      console.error("Error:", err);
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const updateReminderStatuses = async (remindersData: Reminder[]) => {
    const now = new Date();

    for (const reminder of remindersData) {
      const reminderDate = new Date(reminder.reminder_date);
      const expirationDate = new Date(reminder.expiration_date);

      let newStatus = reminder.status;

      if (expirationDate < now) {
        newStatus = "expired";
      } else if (reminderDate <= now && reminder.status === "pending") {
        newStatus = "sent";
        // In a real app, send email/notification here
        await sendReminder(reminder);
      }

      if (newStatus !== reminder.status) {
        await supabase
          .from("reminders")
          .update({ status: newStatus })
          .eq("id", reminder.id);
      }
    }
  };

  const sendReminder = async (reminder: Reminder) => {
    try {
      if (reminder.reminder_type === "email" || reminder.reminder_type === "both") {
        // Email reminder (integrate with your email service)
        console.log(`Sending email reminder for ${reminder.document_name}`);
      }
      if (reminder.reminder_type === "in_app" || reminder.reminder_type === "both") {
        // In-app notification
        toast.success(`📅 Reminder: ${reminder.document_name} expires on ${formatDate(reminder.expiration_date)}`);
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    
    if (!formData.document_name.trim()) {
      toast.error("Please enter a document name");
      return;
    }
    
    if (!formData.expiration_date) {
      toast.error("Please select an expiration date");
      return;
    }
    
    if (!formData.reminder_date) {
      toast.error("Please select a reminder date");
      return;
    }

    const expirationDate = new Date(formData.expiration_date);
    const reminderDate = new Date(formData.reminder_date);

    if (reminderDate >= expirationDate) {
      toast.error("Reminder date must be before expiration date");
      return;
    }

    try {
      const reminderData = {
        document_name: formData.document_name,
        expiration_date: formData.expiration_date,
        reminder_date: formData.reminder_date,
        reminder_type: formData.reminder_type,
        user_id: user.id,
        status: "pending" as const,
      };

      if (editingReminder) {
        const { error } = await supabase
          .from("reminders")
          .update(reminderData)
          .eq("id", editingReminder.id);

        if (error) throw error;
        toast.success("Reminder updated!");
      } else {
        const { error } = await supabase
          .from("reminders")
          .insert([{ ...reminderData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        toast.success("Reminder created!");
      }

      resetForm();
      fetchReminders();
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err?.message || "Failed to save reminder");
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      document_name: reminder.document_name,
      expiration_date: reminder.expiration_date,
      reminder_date: reminder.reminder_date,
      reminder_type: reminder.reminder_type,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    try {
      const { error } = await supabase.from("reminders").delete().eq("id", id);

      if (error) throw error;
      toast.success("Reminder deleted!");
      fetchReminders();
    } catch (err: any) {
      toast.error("Failed to delete reminder");
    }
  };

  const resetForm = () => {
    setFormData({
      document_name: "",
      expiration_date: "",
      reminder_date: "",
      reminder_type: "both",
    });
    setEditingReminder(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysUntil = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "sent":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "expired":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Smart Reminders</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Never miss a document expiration date
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-5 h-5" /> New Reminder
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Total</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <FiBell className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Pending</p>
                <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Sent</p>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.sent}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">Expired</p>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.expired}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <FiAlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <FiBell className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No reminders yet</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Create your first reminder to never miss a document expiration
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-lg/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {reminder.document_name}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(reminder.status)}`}>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiCalendar className="w-4 h-4" />
                        <span>Expires: {formatDate(reminder.expiration_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiClock className="w-4 h-4" />
                        <span>Remind: {formatDate(reminder.reminder_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiBell className="w-4 h-4" />
                        <span>{reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1)}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      {daysUntil(reminder.expiration_date) > 0
                        ? `${daysUntil(reminder.expiration_date)} days remaining`
                        : "Expired"}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors flex items-center gap-1 pointer-events-auto"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center gap-1 pointer-events-auto"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 pointer-events-auto"
          onClick={() => {
            setShowCreateModal(false);
            resetForm();
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 pointer-events-auto">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingReminder ? "Edit Reminder" : "Create New Reminder"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-2xl leading-none pointer-events-auto"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 pointer-events-auto">
              {/* Document Name */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={formData.document_name}
                  onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
                  placeholder="e.g., Passport, Insurance Policy"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
              </div>

              {/* Expiration Date */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
              </div>

              {/* Reminder Date */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 pointer-events-auto">
                  Reminder Date *
                </label>
                <input
                  type="date"
                  value={formData.reminder_date}
                  onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pointer-events-auto"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  When should you be reminded? (must be before expiration date)
                </p>
              </div>

              {/* Reminder Type */}
              <div className="pointer-events-auto">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 pointer-events-auto">
                  Reminder Type
                </label>
                <div className="space-y-2">
                  {(["email", "in_app", "both"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer pointer-events-auto">
                      <input
                        type="radio"
                        name="reminder_type"
                        value={type}
                        checked={formData.reminder_type === type}
                        onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value as any })}
                        className="w-4 h-4 pointer-events-auto"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 pointer-events-auto">
                        {type === "email" && "📧 Email Reminder"}
                        {type === "in_app" && "🔔 In-App Notification"}
                        {type === "both" && "📧 Email & In-App"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pointer-events-auto">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex-1 pointer-events-auto"
              >
                {editingReminder ? "Update Reminder" : "Create Reminder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}