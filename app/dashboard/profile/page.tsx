import { ProfileMenu } from "@/components/dashboard/profile/ProfileMenu";
import { getCurrentUser } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if(!user) return 
  const isPro = await checkSubscription(user.id);

  return (
    <div className="w-full flex justify-center min-h-screen bg-white">
      <div className="w-full md:w-5xl px-4 pt-8 md:p-8 md:max-w-xl">
        {/* HEADER */}
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-black text-[#333]">Account</h1>
          <p className="text-[#494949] text-15 font-ligth">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-row gap-2 items-center px-3 py-4 rounded-3xl bg-[#F2F2F2]">
          <div className="flex justify-center items-center w-14 h-14 rounded-full shadow-md bg-linear-120 from-[#4F39F6] to-purple-500">
            <p className="text-white font-bold text-3xl">{user.firstName.at(0)?.toUpperCase()}</p>
          </div>
          
          <div className="flex flex-col gap-1">
            <h1 className="text-lg text-[#111] font-semibold leading-none">{user?.firstName}</h1>
            <h2 className="text-base text-[#333] font-light leading-none">{user.email}</h2>
          </div>
        </div>

        <ProfileMenu 
          user={{ 
            firstName: user.firstName, 
            email: user.email 
          }}
          subscription={{ 
            isPro,
            periodEnd: user.stripeCurrentPeriodEnd || null,
            cancelAtPeriodEnd: user.stripeCancelAtPeriodEnd || false
          }}
        />
      </div>
    </div>
  );
}
