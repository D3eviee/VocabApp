import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/schema";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (!token) return null;
    
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = payload.userId as string;
        if (!userId) return null;
        
        const [user] = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
        
        return user || null;
    } catch (error) { 
        return null
    }
}