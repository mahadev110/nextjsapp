import Link from "next/link";
import LoginPage from "./login/page";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Student Messaging Portal</h1>
        <p className="text-lg mb-6 text-gray-600">Please login to continue</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
       
      </div> */}
       <LoginPage />
    </main>
  );
}
