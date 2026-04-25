"use client";
import { useActionState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import AuthToggle from "./AuthToggle";
import SubmitButton from "./SubmitButton";
import FormHeader from "./FormHeader";

export default function RegisterForm({ onToggleForm }: {onToggleForm: () => void;}) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(registerAction, null);
    
    useEffect(() => {
        if (state?.success) router.push("/dashboard");
    }, [state?.success, router]);
    
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 ease-out">
            <FormHeader title="Create your account" description="Start learning effectively today."/>
            
            <form action={formAction} className="flex flex-col gap-5">
                <InputField label="First Name" type="text" name="firstName" placeholder="Hipolit" required />
                <InputField label="Email" type="email" name="email" placeholder="name@example.com" required />
                <InputField label="Password" type="password" name="password" placeholder="••••••••" required />
                {state?.error && <p className="text-13 font-semibold text-red-500 text-center animate-in fade-in slide-in-from-bottom-1">{state.error}</p>}
                
                <SubmitButton isPending={isPending}>
                    Continue <ArrowRight size={18} strokeWidth={2.5} />
                </SubmitButton>
            </form>

            <AuthToggle isLogin={false} onToggle={onToggleForm} />
        </div>
    );
}