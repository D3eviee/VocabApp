"use server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/schema";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

export type ActionState = {
  success: boolean;
  error?: string;
  message?: string;
  email?: string; 
  firstName?: string; 
  timestamp?: number;
};

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const firstNameRaw = formData.get("firstName")?.toString() || "";
    const emailRaw = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const timestamp = Date.now();

    if (!firstNameRaw || !emailRaw || !password || !confirmPassword)
        return { success: false, error: "Please fill in all fields.", email: emailRaw, firstName:firstNameRaw, timestamp };
    
    // CLEANING FORMDATA
    const email = emailRaw.replace(/\s+/g, "").toLowerCase();
    const firstName = firstNameRaw.replace(/\s+/g, " ").trim();

    // PASSWORD CHECKS
    if (password !== confirmPassword) return { success: false, error: "Passwords do not match.", email, firstName, timestamp };
    if (password.length < 8) return { success: false, error: "Password must be at least 8 characters long.", email, firstName, timestamp };
    
    try {
        // DOES USER EXISTS
        const existingUserResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUserResult.length > 0) 
            return { success: false, error: "An account with this email already exists.", email, firstName, timestamp };
        
        // HASHING PASSWORD
        const passwordHash = await bcrypt.hash(password, 10);
        
        // CREATING NEW USER
        const newUser = await db.insert(users).values({
            firstName: firstName, 
            email: email,  
            passwordHash: passwordHash,
        }).returning({ id: users.id }); 
        
        // SUCCESS
        await createSession(newUser[0].id);    
        return { success: true, message: "Account created successfully!" };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "An unexpected error occurred.", email, firstName, timestamp };
    }
}


export async function loginAction( prevState: ActionState, formData: FormData ): Promise<ActionState> {
    const emailRaw = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString();

    if (!emailRaw || !password) return { success: false, error: "Please provide both email and password.", email: emailRaw, timestamp: Date.now() }
    
    try {
        const email = emailRaw.trim().toLowerCase();
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = userResult[0];
        if (!user) return { success: false, error: "Invalid email or password.", email, timestamp: Date.now() };
    
        // PASSWORD CHECK
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return { success: false, error: "Invalid email or password.", email, timestamp: Date.now() };
            
        // SUCCESS
        await createSession(user.id);    
        return { success: true, message: "Logged in successfully" };

    } catch (error) {
        return { success: false, error: "An unexpected error occurred.", email: emailRaw, timestamp: Date.now() };
    }
}

// CREATING SESSION FUNCTION
async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 DAYS
    
    const sessionToken = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET_KEY);
        
    const cookieStore = await cookies();    
    cookieStore.set("auth_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/");
}