"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleLogin = async () => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    console.error("Invalid JSON in response");
    return;
  }

  if (!res.ok) {
    console.error("Login failed:", data?.message);
    return;
  }

  console.log("Login success:", data);

  // Optional: Save token to localStorage
  localStorage.setItem("token", data.token);

  // Redirect based on role
  if (data.role === "ADMIN") {
    router.push("/admin");
  } else if (data.role === "STUDENT") {
    router.push("/student");
  } else {
    console.error("Unknown role:", data.role);
  }
};



  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">🔐 Login</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Mobile"
        className="w-full mb-4 p-2 border rounded"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
}
