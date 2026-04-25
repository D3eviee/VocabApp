"use server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/schema";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

export async function registerAction(prevState: any, formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password || !firstName) return { error: "All fields are required." };
    if (password.length < 6) return { error: "Password must be at least 6 characters." };
    
    try {
        const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

        if (existingUser.length > 0) return { error: "Account with this email already exists." };
        
        // HASHING PASSWORD
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // SAVING USER TO DB
        const [newUser] = await db.insert(users).values({
            email,
            passwordHash,
            firstName,
        }).returning({ id: users.id });

        // CREATING SESSION AFTER USER REGISTRATION
        await createSession(newUser.id);
    
        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong during registration." };
    }
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) return { error: "Please provide both email and password." };
    
    try {
        const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
        
        const user = userResult[0];
        // IF USER DOES NOT EXISTS
        if (!user) return { error: "Invalid email or password." };
        // IF EXISTS WE CHECK PASSWORD
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return { error: "Invalid email or password." };
        
        await createSession(user.id);    
        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "An unexpected error occurred." };
    }
}

// CREATING SESSION FUNCTION
async function createSession(userId: string) {
    // 7 DAYS
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
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