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

   
const fetchMessages = async () => {
  try {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
};

useEffect(() => {
  fetchMessages();
}, []);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ standard, section, content: message }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("✅ Message sent successfully.");
      setMessage("");
       fetchMessages(); 
    } else {
      setStatus(`❌ ${data.message}`);
    }
  };

  return (
<div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
  {/* LEFT: Send Message Form */}
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
      ➤ Send Message
    </button>
  </div>

  {/* RIGHT: Message List */}
  <div className="bg-white p-6 rounded-xl shadow border overflow-y-auto max-h-[600px]">
    <h2 className="text-2xl font-bold text-green-700 mb-4">📬 Messages Sent</h2>

    {messages.length === 0 ? (
      <p className="text-gray-500 text-sm">No messages sent yet.</p>
    ) : (
      <ul className="space-y-4">
        {messages.map((msg, index) => (
          <li key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="text-gray-800 font-medium mb-1">
              Std: {msg.standard} — Sec: {msg.section}
            </div>
            <div className="text-sm text-gray-600">{msg.content}</div>
            <div className="text-xs text-right text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

  );
}
