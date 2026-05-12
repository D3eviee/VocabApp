"use client";
import { useEffect } from "react";
import { ModalType } from "@/store/modal-store"; // upewnij się, że ścieżka jest ok

interface BaseDialogProps {
  isOpen: boolean;
  type: ModalType | null;
  targetType: ModalType;
  onClose: () => void;
  children: React.ReactNode;
}

export const BaseDialog = ({ isOpen, type, targetType, children }: BaseDialogProps) => {
    useEffect(() => {
        if (isOpen && type === targetType) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen, type, targetType]);
    
    if (!isOpen || type !== targetType) return null;
    
    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            {/* BACKGROUND BLUR BG */}
            <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-md transition-opacity" />
            
            {/* DIALOG BOX */}
            <div className="relative bg-white w-full max-w-md rounded-4xl shadow-2xl px-6 py-8 md:px-8 md:max-w-100 animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
  );
};