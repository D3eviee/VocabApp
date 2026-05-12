"use client";
import { useState, useRef, useEffect, MouseEvent } from "react";
import { Plus, Layers, Presentation, X } from "lucide-react";
import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside";
import { useModal } from "@/store/modal-store";

export const AddDeckButton = () => {
    const { onOpen } = useModal();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(menuRef, () => setIsOpen(false));
    
    const handleNewDeck = (e: MouseEvent<HTMLButtonElement>, type: "createRoadmap" | "createDeck") => {
        e.stopPropagation(); 
        setIsOpen(false); 
        onOpen(type)
    }
    
    return (
        <div 
            ref={menuRef} 
            onClick={() => !isOpen && setIsOpen(true)}
            className={`fixed bottom-6 right-6 md:hidden bg-[#111] overflow-hidden shadow-[0_8px_30px_rgba(4,7,17,0.25)] transition-all duration-300 ease-in-out flex flex-col justify-center ${isOpen ? 'w-63 h-46 rounded-4xl cursor-default p-4' : 'w-15 h-15 rounded-3xl cursor-pointer items-center'}`}
        >
            {isOpen ? (
                <div className="w-full h-full flex flex-col justify-between animate-in fade-in duration-300 delay-75">
                    {/* HEADER */}
                    <div className="flex justify-between items-center text-gray-300">
                        <p className="text-xs font-bold uppercase tracking-wider pl-1">Add</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                            className="p-1.5 bg-white/0 hover:bg-white/10 rounded-lg hover:cursor-pointer"
                        >
                            <X size={16} strokeWidth={2.5}/>
                        </button>
                    </div>
                
                    <button 
                        onClick={(e) => { handleNewDeck(e, "createDeck") }} 
                        className="flex items-center gap-3 p-2 rounded-2xl duration-75 transition-all hover:bg-[#222] hover:cursor-pointer active:scale-95"
                    >
                        <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            <Layers size={16} strokeWidth={2.5} />
                        </div>
                        <span className="font-semibold text-sm text-white">Classic Deck</span>
                    </button>
                    
                    <button 
                        onClick={(e) => { handleNewDeck(e, "createRoadmap") }} 
                        className="flex items-center gap-3 p-2 rounded-2xl duration-75 transition-all hover:bg-[#222] hover:cursor-pointer active:scale-95"
                    >
                        <div className="w-8 h-8 shrink-0 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            <Presentation size={16} strokeWidth={2.5} />
                        </div>
                        <span className="font-semibold text-sm text-white">Storyboard</span>
                    </button>
                </div>
                ) : (
                <div className="animate-in fade-in duration-200">
                    <Plus color="white" strokeWidth={2.5} size={28} />
                </div>
            )}
        </div>
    )
}