"use client";
import { useActionState, useEffect, useState } from "react";
import { ActionState, registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { InputField } from "./InputField";
import { FormHeader } from "./FormHeader"; 
import { SubmitButton } from "./SubmitButton";

const initialState: ActionState = {
  success: false,
};

export default function RegisterForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(registerAction, initialState);
    const [emailInput, setEmailInput] = useState(state?.email || "");
    const [nameInput, setNameInput] = useState(state?.firstName || "");
    
    useEffect(() => {
        if (state?.success) router.push("/dashboard");
    }, [state?.success, router]);

    
    useEffect(() => {
        if (state?.email) setEmailInput(state.email);
        if (state?.firstName) setNameInput(state.firstName);
    }, [state?.email, state?.firstName]);
    
    return (
        <div className="w-full mx-auto pt-12 sm:max-w-115">
            <FormHeader title="Create an account" description="Start building your flashcard decks today."/>
            
            <form action={formAction} className="flex flex-col gap-3 mt-8">
                <InputField
                    key={`firstName-${state?.timestamp || 'initial'}`}
                    label="First name"
                    type="text"
                    name="firstName"
                    id="firstName"
                    defaultValue={state?.firstName || ""}
                    disabled={isPending}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                />

                <InputField
                    key={`email-${state?.timestamp || 'initial'}`}
                    label="Email or Phone Number"
                    type="text"
                    name="email"
                    id="email"
                    defaultValue={state?.email || ""}
                    disabled={isPending}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                />
                
                <InputField
                    key={`pass1-${state?.timestamp || "initial"}`}
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    disabled={isPending}
                    required
                />

                <InputField
                    key={`pass2-${state?.timestamp || "initial"}`}
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    disabled={isPending}
                    required
                />

                {state?.error && <p className="text-13 font-medium text-red-500 text-center w-fit ml-4">{state.error}</p>}

                <SubmitButton
                    isPending={isPending}
                    disabled={emailInput.trim() === "" || nameInput.trim() === ""}
                    className="mt-8"
                >
                    Sign Up
                </SubmitButton>
            </form>
        </div>
    );
}