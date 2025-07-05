"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  standard: string;
  section: string;
  createdAt: string;
}

export default function StudentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/messages/student", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        } else {
          setError(data.message || "Failed to load messages.");
        }
      })
      .catch(() => setError("Network error."));
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold mb-6">📬 Your Messages</h1>

      {error && <p className="text-red-600">{error}</p>}

      {messages.length === 0 && !error && <p>No messages yet.</p>}

      <ul className="space-y-4">
        {messages.map((msg) => (
          <li key={msg.id} className="bg-gray-100 p-4 rounded shadow">
            <p>{msg.content}</p>
            <span className="block text-sm text-gray-500 mt-1">
              For Std {msg.standard} - Sec {msg.section} •{" "}
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
