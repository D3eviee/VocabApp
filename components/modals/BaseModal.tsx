"use client";
import { useModal } from "@/store/modal-store";
import { X } from "lucide-react";

export default function BaseModal({ title, children, isOpen, type, targetType }: any) {
  const { onClose } = useModal();
  if (!isOpen || type !== targetType) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl  border-white/40 p-8 animate-in zoom-in-95 fade-in duration-300 ">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#111]">{title}</h2>

          <button onClick={onClose} className="text-[#999] hover:bg-[#F2F2F2] p-1 rounded-md active:scale-95 transition-all duraion-75">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}