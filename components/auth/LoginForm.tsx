"use client";

import React, { useActionState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import AuthToggle from "./AuthToggle";
import SubmitButton from "./SubmitButton";
import FormHeader from "./FormHeader";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginAction, null);
    
    useEffect(() => {
        if (state?.success) router.push("/dashboard");
    }, [state?.success, router]);
    
    
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 ease-out">
            <FormHeader title="Welcome back" description="Enter your details to access your decks."/>
            
            <form action={formAction} className="flex flex-col gap-5">
                <InputField  label="Email" type="email" name="email" placeholder="name@example.com" required />
                <InputField  label="Password" type="password" name="password" placeholder="••••••••"  required 
                    action={<button type="button" className="text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-colors">Forgot?</button>}/>
                
                {state?.error && (<p className="text-13 font-semibold text-red-500 text-center animate-in fade-in slide-in-from-bottom-1">{state.error}</p>)}
                
                <SubmitButton isPending={isPending}> 
                    Sign In <ArrowRight size={18} strokeWidth={2.5} />
                </SubmitButton>
            </form>
            <AuthToggle isLogin={true} onToggle={onToggleForm} />
        </div>
    );
}