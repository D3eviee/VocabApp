"use client";
import { IdCardIcon, CreditCard, KeyRound, ChevronRight } from "lucide-react";
import { useModal } from "@/store/modal-store";

type ProfileMenuProps = {
  user: { firstName: string; email: string,  };
  subscription: { isPro: boolean; periodEnd: Date | null; cancelAtPeriodEnd: boolean; };
};
export const ProfileMenu = ({ user, subscription }: ProfileMenuProps) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        {/* PERSONAL INFO BUTTON */}
        <button 
          onClick={() => onOpen("editProfile", { user })}
          className="w-full px-4 py-5 flex flex-row items-center justify-between bg-[#F2F2F2] rounded-3xl hover:bg-[#E8E8E8] transition-colors active:scale-[0.98] cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <IdCardIcon size={20} strokeWidth={2} color="#000"/>
            <p className="text-15 text-black mt-0.5 font-medium">Personal Information</p>
          </div>
          <ChevronRight size={24} strokeWidth={2} color="#333"/>
        </button>

        {/* SECURITY BUTTON */}
        <button 
          onClick={() => onOpen("editSecurity")}
          className="w-full px-4 py-5 flex flex-row items-center justify-between bg-[#F2F2F2] rounded-3xl hover:bg-[#E8E8E8] transition-colors active:scale-[0.98] cursor-pointer"
        >
          <div className="flex flex-row items-center gap-2">
            <KeyRound size={20} strokeWidth={2} color="#000"/>
            <p className="text-15 text-black mt-0.5 font-medium">Sign-In & Security</p>
          </div>
          <ChevronRight size={24} strokeWidth={2} color="#333"/>
        </button>

        {/* SUBSCRIPTION */}
        <button 
          onClick={() => onOpen("subscription", { subscription })}
          className="w-full px-4 py-5 flex flex-row items-center justify-between bg-[#F2F2F2] rounded-3xl hover:bg-[#E8E8E8] transition-colors active:scale-[0.98] cursor-pointer">
          <div className="flex flex-row items-center gap-2">
            <CreditCard size={20} strokeWidth={2} color="#000"/>
            <p className="text-15 text-black mt-0.5 font-medium">Subscription</p>
          </div>
          <ChevronRight size={24} strokeWidth={2} color="#333"/>
        </button>
      </div>

      {/* DELETE ACCOUNT BUTTON */}
      <button 
        onClick={() => onOpen("deleteAccountConfirm")}
        className="w-full px-4 py-5 text-center bg-[#F74652] hover:bg-[#E03A45] active:scale-[0.98] transition-all text-white font-semibold rounded-3xl mt-10 cursor-pointer"
      >
        Delete Account
      </button>
    </>
  );
};