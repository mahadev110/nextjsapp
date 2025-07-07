"use client";

import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

interface Message {
  id: string;
  content: string;
  standard: string;
  section: string;
  createdAt: string;
}

export default function AdminPage() {
  const [standard, setStandard] = useState("8");
  const [section, setSection] = useState("A");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const res = await fetch("/api/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setMessages(data.messages || data); // works for both { messages: [...] } or raw array
    } else {
      console.error("Failed to fetch messages:", data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchMessages();
    }, 100); // slight delay to ensure token is available
  }, []);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    const url = editingId ? `/api/messages/${editingId}` : "/api/messages/send";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: message, standard, section }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus(editingId ? "✅ Message updated." : "✅ Message sent.");
      setMessage("");
      setEditingId(null);
      await fetchMessages();
    } else {
      setStatus(`❌ ${data.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } else {
      alert("Failed to delete message");
    }
  };

  const handleEdit = (msg: Message) => {
    setMessage(msg.content);
    setStandard(msg.standard);
    setSection(msg.section);
    setEditingId(msg.id);
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      {/* LEFT: Form */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <LogoutButton />
        <h1 className="text-2xl font-bold mb-6 text-blue-700">📢 Send Message</h1>

        {status && <p className="mb-4 text-sm text-green-600 font-medium">{status}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">Standard</label>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </div>

        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {editingId ? "✏️ Update Message" : "➤ Send Message"}
        </button>
      </div>

      {/* RIGHT: Message List */}
      <div className="bg-white p-6 rounded-xl shadow border overflow-y-auto max-h-[600px]">
        <h2 className="text-2xl font-bold text-green-700 mb-4">📬 Messages Sent</h2>

        {loading ? (
          <p className="text-gray-400">Loading messages...</p>
        ) : messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border rounded-lg p-4 shadow-sm relative group"
              >
                <div className="text-gray-800 font-medium mb-1">
                  Std: {msg.standard} — Sec: {msg.section}
                </div>
                <div className="text-sm text-gray-600 mb-2">{msg.content}</div>
                <div className="text-xs text-right text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(msg)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No messages sent yet.</p>
        )}
      </div>
    </div>
  );
}
