'use client'
import { useModal } from '@/store/modal-store';
import { CreateMenu } from './CreateMenu';
import { Bot } from 'lucide-react';

export const DashboardHeaderActions = () => {
    const { onOpen } = useModal();
    
    return (
        <div className="hidden md:flex items-center gap-3 h-full mt-0">
            {/* COMPONENT FOR CREATING DECKS */}
            {/* CONTAINS AND OPENS DROPDOWN MENU */}
            <CreateMenu/>
            
            {/* OPENS MODAL FOR CREATING DECK WITH AI*/}
            <button 
                onClick={() => onOpen("aiDeckGenerator")}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 font-semibold text-[13px] outline-light-border text-white rounded-xl active:scale-95 cursor-pointer bg-main-gradient hover:bg-linear-to-tl"
            >
                <Bot size={16} strokeWidth={2} />
                <span className="sm:inline">Create with AI</span>
            </button>
        </div>
    );
}