"use client";
import { useState } from "react";
import { MoreVertical, Trash2, RotateCcw } from "lucide-react";
import { useModal } from "@/store/modal-store"; // Importujemy Zustanda

export const DashboardDeckOptionMenu = ({ deckId }: { deckId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { onOpen } = useModal();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        onOpen("deleteDeckConfirm", { deckId }); 
    };

    const handleResetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        onOpen("resetDeckConfirm", { deckId }); 
    };

    return (
        <div className="absolute top-5.5 right-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-[#C7C7D4] rounded-xl transition-colors hover:cursor-pointer hover:bg-[#EFEEF4] hover:text-[#333]"
            >
                <MoreVertical size={20} strokeWidth={1.5} />
            </button>

            {isOpen && (
                <>
                    {/* TRANSPARENT BG FOR CLOSING MENU  */}
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}/>
                    
                    {/* MENU */}
                    <div className="absolute inset-shadow-2xs right-7 top-0 md:right-2 md:top-7 w-38.5 md:w-32.5 bg-white rounded-xl shadow-lg border-[0.5px] border-[#F2F2F2] z-50 overflow-hidden ">
                        <button 
                            onClick={handleResetClick}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#494949] transition-colors font-medium hover:bg-[#F2F2F2] hover:cursor-pointer border-b border-gray-100"
                        >
                            <RotateCcw size={16} strokeWidth={2} />
                            Reset
                        </button>
                        <button 
                            onClick={handleDeleteClick}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 transition-colors font-medium hover:bg-[#F2F2F2] hover:cursor-pointer"
                        >
                            <Trash2 size={16} strokeWidth={2} />
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};