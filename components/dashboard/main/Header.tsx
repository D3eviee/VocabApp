'use client'
import { useModal } from '@/store/modal-store';
import { Plus, Layers } from 'lucide-react';

type HeaderProps = {
    user: {
        id: string;
        firstName: string | null;
        email: string;
    } | null
}

export default function Header({user}:HeaderProps) {
    const { onOpen } = useModal();
    
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user && user?.firstName}</h1>
                <p className="text-gray-500 mt-1">Let's see how u progressing!</p>
            </div>
            
            <div className="flex items-center gap-3 mt-6 md:mt-0">
                <button 
                    onClick={() => onOpen("createDeck")}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                    <Layers size={18} className="text-blue-500" />
                    New Deck
                </button>

                <button 
                    onClick={() => onOpen("createRoadmap")}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                    <Plus size={18} />
                    New Roadmap
                </button>
            </div>
        </header>
    );
}