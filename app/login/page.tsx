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
    <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Welcome to Student Portal
      </h1>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Login 
      </h1>

      {error && (
        <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>
      )}

      <div className="space-y-5">
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-lg shadow-sm"
        >
          Login
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
