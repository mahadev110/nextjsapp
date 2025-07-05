"use client";

import { useState } from "react";

export default function AdminPage() {
  const [standard, setStandard] = useState("8");
  const [section, setSection] = useState("A");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

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
    } else {
      setStatus(`❌ ${data.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📢 Send Message</h1>

      {status && <p className="mb-4 text-sm text-blue-600">{status}</p>}

      <div className="mb-4">
        <label className="block mb-1">Standard</label>
        <select
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Section</label>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
    </div>
  );
}
