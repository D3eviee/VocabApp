"use client";
import { useState } from "react";
import { User, Mail, Save, Loader2, CheckCircle2, Lock } from "lucide-react";
import { useUserQueries } from "@/lib/hooks/useUserQueries";

export const ProfileForm = ({ initialData }: { initialData: any }) => {
  const [name, setName] = useState(initialData?.firstName || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const { updateProfileMutation } = useUserQueries();

  const handleSave = () => {
    updateProfileMutation.mutate(
      { name },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }
        },
      }
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/75 shadow-[0_2px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#111]">Profile Details</h2>
          <p className="text-15 text-gray-[#333] mt-1 font-extralight tracking-tight">Manage your personal information and display name.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-full space-y-12">
            {/* NAME */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#494949] uppercase tracking-wide ml-1">Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2B7FFF] transition-colors">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we call you?"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F7F7F9] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#2B7FFF] focus:ring-4 focus:ring-[#2B7FFF]/15 transition-all text-[#111] font-semibold text-base placeholder:text-gray-400 placeholder:font-medium"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[13px] font-bold text-gray-600 uppercase tracking-wide">Email Address</label>
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  <Lock size={10} strokeWidth={3} /> Read-only
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  disabled
                  value={initialData?.email || ""}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-2xl cursor-not-allowed text-gray-400 font-medium text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE */}
      <div className="px-6 sm:px-8 py-5 bg-[#FAFAFA] border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-center w-full sm:w-auto h-8">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 size={18} strokeWidth={2.5} />
              <span className="text-[14px] font-bold">Successfully updated!</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || name === initialData?.name || name.trim() === ""}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#2B7FFF] text-white text-base font-bold rounded-2xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25"
        >
          {updateProfileMutation.isPending ? (
            <Loader2 size={18} strokeWidth={3} className="animate-spin" />
          ) : (
            <Save size={18} strokeWidth={2.5} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};