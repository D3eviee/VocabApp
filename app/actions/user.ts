'use server'
import { db } from "@/server/db";
import { deckItems, decks, users } from "@/server/schema";
import { eq, lte, sql, and, ne} from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { hash } from "bcryptjs"

// FIRST NAME UPDATE
export async function updateProfileAction(data: { firstName: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!data.firstName || data.firstName.trim().length < 2) {
      return { success: false, error: "Imię musi mieć co najmniej 2 znaki." };
    }

    await db
      .update(users)
      .set({ firstName: data.firstName.trim() })
      .where(eq(users.id, user.id));

    // Odświeżamy ścieżkę, aby UI natychmiast zobaczyło nowe imię
    revalidatePath("/dashboard/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Wystąpił błąd podczas aktualizacji profilu." };
  }
}

// PASSWROD CHANGE
export async function updatePasswordAction(data: { password: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Hasło musi mieć co najmniej 6 znaków." };
    }

    const hPAs = await hash(data.password, 10);
    const hashedPassword = hPAs 

    await db
      .update(users)
      .set({ passwordHash: hPAs }) 
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Password update failed:", error);
    return { success: false, error: "Wystąpił błąd podczas zmiany hasła." };
  }
}

// DELETE ACCOUNT
export async function deleteAccountAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // DELETE AND CLEAN COOKIE
    await db.delete(users).where(eq(users.id, user.id));
    const cookieStore = await cookies();
    cookieStore.delete("auth_session"); 

    return { success: true };
  } catch (error) {
    console.error("Account deletion failed:", error);
    return { success: false, error: "Account deletion failed - error occured" };
  }
}