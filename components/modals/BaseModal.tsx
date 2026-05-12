"use client";
import { ModalType, useModal } from "@/store/modal-store";
import { X } from "lucide-react";
import { useEffect } from "react";

interface BaseModalProps {
  title: string
  isOpen: boolean;
  type: ModalType | null;
  targetType: ModalType;
  onClose: () => void;
  children: React.ReactNode;
}

export const BaseModal = ({ title, children, isOpen, type, targetType }: BaseModalProps) => {
  const { onClose } = useModal();
  useEffect(() => {
    if (isOpen && type === targetType) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, type, targetType]);
    
  if (!isOpen || type !== targetType) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-md transition-opacity" onClick={onClose}/>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-4xl shadow-2xl px-6 py-8 md:px-8 md:max-w-100">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#111]">{title}</h2>

          <button onClick={onClose} className="text-[#999] hover:bg-[#F2F2F2] p-1 rounded-md active:scale-95 transition-all duraion-75 hover:cursor-pointer">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}