import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="md:w-5xl p-4 md:p-8">
        {/* HEADER */}
        <div className="flex  flex-col mb-6">
          <h1 className="text-2xl font-black text-[#111]">Account</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your profile and preferences</p>
        </div>
      
        <ProfileForm initialData={user} />
        </div>
    </div>
  );
}