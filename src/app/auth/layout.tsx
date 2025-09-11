// app/layout/AuthLayout.tsx
"use client";
import ThemeToggle from "@/components/buttons/ToggleButton";
import { FaUserPlus } from "react-icons/fa";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
        <ThemeToggle/>
      <div className="w-full max-w-4xl rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">
          <FaUserPlus className="text-6xl mb-4 " />
          <h2 className="text-3xl font-bold mb-2">Join Us</h2>
          <p className="text-center text-lg">
            Create your account and start your journey today.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-4 md:p-10">{children}</div>
      </div>
    </div>
  );
}