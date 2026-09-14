"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
interface BaseModalProps {
  title?: string
  subtitle?: string
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const BaseModal = ({ title, subtitle, children, isOpen, onClose }: BaseModalProps) => {
  useEffect(() => {
    if (isOpen) 
      document.body.style.overflow = "hidden";
    else 
      document.body.style.overflow = "unset";
    
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
    
  if (!isOpen) return null;

  return (
    <div  
      className="fixed inset-0 z-200 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
     <div 
      className="absolute top-0  inset-0 bg-gray-white/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
      onClick={onClose}
    />
      
      {/* Modal Content */}
      <div className="bg-white relative w-full max-w-md rounded-4xl shadow-2xl md:p-8 md:max-w-100">
        <div className="flex flex-row justify-between items-center mb-6">
          {title && <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-heading">{title}</h2>
            {subtitle && <p className="text-xs font-light text-subheading">{subtitle}</p>}
          </div>}
          

          {onClose && <button 
            onClick={onClose} 
            aria-label="Close modal"
            className="text-[#999] hover:bg-light-border p-1 rounded-md active:scale-95 transition-all duraion-75 hover:cursor-pointer hover:rotate-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          }
        </div>
        {children}
      </div>
    </div>
  );
}