"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  role: string;
  standard: string;
  section: string;
  username?: string;
  mobile: string;
}

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

  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // ✅ Decode token safely inside useEffect
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setStudentName(decoded.username || decoded.mobile);
    } catch (err) {
      console.error("Invalid token");
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
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <LogoutButton />

      {studentName && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Welcome, {studentName}!
        </h2>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
        <h1 className="text-xl font-bold text-blue-700 mb-4 text-center">
          Your Messages
        </h1>

        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}

        {messages.length === 0 && !error && (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}

        <ul className="space-y-6">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="bg-gray-50 border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-medium text-gray-800 mb-2">
                {msg.content}
              </p>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>
                  🎓 Std {msg.standard} - Sec {msg.section}
                </span>
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
