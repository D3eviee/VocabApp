"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, RotateCcw } from "lucide-react";
import { useModal } from "@/store/modal-store"; // Importujemy Zustanda

export const ThumbnailOptionMenu = ({ deckId, reset=true }: { deckId: string, reset?:boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { onOpen } = useModal();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setTimeout(() => onOpen("deleteDeckConfirm", { deckId }), 0)
    };

    const handleResetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setTimeout(() => onOpen("resetDeckConfirm", { deckId }), 0);
    };

    return (
        <div ref={menuRef} className="absolute top-5.5 right-4">
            {/* MENU TRIGGER BUTTON  */}
            <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                aria-label="Deck options"
                aria-haspopup="true"
                aria-expanded={isOpen}
                className="p-1 text-[#C7C7D4] rounded-lg transition-colors hover:cursor-pointer hover:bg-light-border hover:text-[#333]"
            >
                <MoreVertical size={16} strokeWidth={2} />
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && (
              <>
                {/* BACKDROP BG - FOR MOBILE */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false)
                  }
                  }
                  aria-hidden="true" 
                />

                <div
                  role="menu"
                  className="absolute z-50 backdrop-blur-xl bg-white/50 shadow-2xl sm:right-0 sm:top-[calc(100%+4px)] outline-1 outline-light-border w-fit p-2 rounded-2xl"
                >
                  <div className="flex flex-col">
                    {reset && 
                        <button 
                            role="menuitem"
                            onClick={handleResetClick}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:backdrop-blur-xs border-[1.5px] border-transparent hover:border-[#F2F2F2]"
                        >
                            <RotateCcw size={16} strokeWidth={2} />
                            <span className="text-xs font-medium text-subheading text-nowrap">Reset</span>
                        </button>
                    }
                    <button 
                        role="menuitem"
                        onClick={handleDeleteClick}
                        className="w-full flex items-center text-red-500 gap-2 px-3 py-2 rounded-xl cursor-pointer hover:backdrop-blur-xs border-[1.5px] border-transparent hover:border-[#F2F2F2]"
                    >
                        <Trash2 size={16} strokeWidth={2} />
                        <span className="text-xs font-medium text-red-500 text-nowrap">Delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}
        </div>
    );
};
