"use client"
import { useState } from "react";
import { Brain } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const toggleView = () => {
    setIsLoginView((prev) => !prev)
    console.log(isLoginView)
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden ">
      <nav className="top-0 left-0 right-0 px-2 py-3 border-b border-b-[#D4D4D4] flex justify-between md:min-w-243 md:mx-auto">
        <div className="rounded-xl flex">
          <Brain color="#4F39F6" size={22} strokeWidth={2} />
        </div>

        <button 
          type="button"
          className="bg-[#4F39F6] px-2 rounded-2xl text-white font-semibold text-13 hover:cursor-pointer"
          onClick={toggleView}
        >
          {isLoginView ? "CREATE ACCOUNT" : "LOGIN"}
        </button>
      </nav>

      {/* FORM */}
      <div className="min-h-screen w-full z-100 flex flex-col px-2">
        {isLoginView ? <LoginForm/> : <RegisterForm/>}
      </div>
    </div>
  );
}