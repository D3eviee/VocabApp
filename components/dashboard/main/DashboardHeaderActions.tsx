'use client'
import { useModal } from '@/store/modal-store';
import { Plus, Layers3 } from 'lucide-react';

export const DashboardHeaderActions = () => {
    const { onOpen } = useModal();
    
    return (
        <div className="hidden md:flex items-center gap-3 h-full mt-0">
            <button 
                onClick={() => onOpen("createDeck")}
                className="flex items-center gap-1.5 outline-2 outline-[#EFEEF4] bg-white hover:bg-[#EFEEF4] text-[#333] px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 hover:cursor-pointer"
            >
                <Layers3 size={18} color='#333' />
                New Deck
            </button>

            <button 
                onClick={() => onOpen("createRoadmap")}
                className="flex items-center gap-1.5 outline-2 outline-[#EFEEF4] bg-white hover:bg-[#EFEEF4] text-[#333] px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 hover:cursor-pointer"
            >
                <Plus size={18} color='#333'/>
                New Roadmap
            </button>
        </div>
    );
}