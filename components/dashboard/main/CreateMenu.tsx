"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { Plus, Layers, BookOpen, Box } from "lucide-react"; 
import { ModalType, useModal } from "@/store/modal-store";

type MenuItem = {
    label:string
    icon:ReactNode
    modal:ModalType
}

const MENU_ITEMS: MenuItem[] = [
    { label: "New Deck", icon: <Layers strokeWidth={1.5} size={16} />, modal: "createDeck" },
    { label: "New Storyboard", icon: <BookOpen strokeWidth={1.5} size={16} />, modal: "createRoadmap" },
    { label: "Playground", icon: <Box strokeWidth={1.5} size={16} />, modal: "createPlayground" },
];

export const CreateMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)){
        setIsOpen(false);
      }
        
    };
    
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block">
      {/* MENU TRIGGER BUTTON  */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center justify-center gap-1 px-2.5 py-1.5 font-semibold text-[13px] bg-[#1A1A1A] hover:bg-[#333] active:scale-95 text-white rounded-xl focus:outline-none cursor-pointer transition-all"
      >
        <Plus size={16} strokeWidth={2} className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
        <span className="sm:inline">Create</span>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
          {/* BACKDROP BG - FOR MOBILE */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true" 
          />

          {/* MENU CONTENT */}
          <div
            role="menu"
            className="absolute z-50 backdrop-blur-xl bg-white/50 shadow-2xl sm:right-0 sm:top-[calc(100%+4px)] outline-1 outline-light-border w-fit p-2 rounded-2xl"
          >
            <div className="flex flex-col">
              {MENU_ITEMS.map((item, _) => (
                <button
                  key={item.label}
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => onOpen(item.modal), 0);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:backdrop-blur-xs border-[1.5px] border-transparent hover:border-[#F2F2F2]"
                >
                  <span className="text-subheading">{item.icon}</span>
                  <span className="text-xs font-medium text-subheading text-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}