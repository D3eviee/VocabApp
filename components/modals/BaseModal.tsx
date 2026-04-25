"use client";
import { useModal } from "@/store/modal-store";
import { X } from "lucide-react";

export default function BaseModal({ title, children, isOpen, type, targetType }: any) {
  const { onClose } = useModal();

  if (!isOpen || type !== targetType) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-white/40 p-8 animate-in zoom-in-95 fade-in duration-300">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} strokeWidth={2.5} />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}