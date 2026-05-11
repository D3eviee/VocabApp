"use client";
import { useActionState, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { ActionState, loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { InputField } from "./InputField";
import { FormHeader } from "./FormHeader";
import { SubmitButton } from "./SubmitButton";


const initialState: ActionState = {
  success: false,
};

export default function LoginForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const [emailInput, setEmailInput] = useState(state?.email || "");
    
    useEffect(() => {
        if (state?.success) router.push("/dashboard");
    }, [state?.success, router]);
    
    
    return (
        <div className="w-full mx-auto pt-40 sm:max-w-115">
            <FormHeader title="Welcome back" description="Enter your details to access your decks."/>
            
            <form action={formAction} className="flex flex-col gap-3">
                <InputField
                    label="Email or Phone Number"
                    type="text"
                    name="email"
                    id="email"
                    defaultValue={state?.email || ""}
                    disabled={isPending}
                    onChange={(e) => setEmailInput(e.target.value)}
                />
                
                <InputField
                    key={state?.timestamp || "password-input"}
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    disabled={isPending}
                    required
                />

                <div className="flex flex-col sm:flex-row sm:justify-between" >
                    {state?.error && (<p className="text-13 font-light text-red-500 text-center animate-in fade-in slide-in-from-bottom-1 w-fit ml-3 mb-1 sm:mb-0">{state.error}</p>)}
                    <p className="text-13 text-right font-light text-blue-500 transition-colors hover:cursor-pointer hover:text-blue-600 mr-3 w-fit ml-3">Forgot password?</p>
                </div>

                <SubmitButton
                    isPending={isPending}
                    disabled={emailInput.trim() === ""}
                    className="mt-12"
                >
                    Sign In
                </SubmitButton>
            </form>
        </div>
    );
}
