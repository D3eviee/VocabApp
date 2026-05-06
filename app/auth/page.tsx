"use client";
import { useState } from "react";
import { BookMarked } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const toggleView = () => setIsLoginView((prev) => !prev);
  
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* BG */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-100 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 p-2.5 rounded-xl text-white shadow-xl">
            <BookMarked size={28} strokeWidth={2.5} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-8">
          {isLoginView ? <LoginForm onToggleForm={toggleView} /> : <RegisterForm onToggleForm={toggleView} /> }
        </div>
      </div>
    </div>
  );
}