"use client";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

export default function NavbarSearchMenu({isSearchOpen}:{isSearchOpen: boolean}) {
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const clearSearch = () => {
    if(!searchInputRef.current) return
    setSearchValue('');
    searchInputRef.current?.focus();
  };

  return(
     <div 
      className={`absolute top-full left-0 w-full grid transition-all duration-300 ease-out bg-white shadow-xl z-10 ${
        isSearchOpen 
          ? 'grid-rows-[1fr] opacity-100 border-b border-gray-200/60 pointer-events-auto' 
          : 'grid-rows-[0fr] opacity-0 border-transparent pointer-events-none'
      }`}
    >
      <div className="overflow-hidden">
        <div className="h-px w-full bg-gray-100 absolute top-0"/>
        <div className="h-16 max-w-5xl mx-auto px-6 flex items-center gap-4">
          <Search size={22} strokeWidth={2} className="text-gray-400 flex shrink-0" />
          
          <input
            ref={searchInputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text" 
            placeholder="Search decks, cards, or folders..." 
            className="flex-1 bg-transparent text-xl md:text-2xl font-semibold outline-none placeholder:text-gray-300 text-gray-900"
          />
          
          {searchValue && (
            <button 
              onClick={clearSearch}
              className="bg-zinc-600 rounded-full p-1 text-white hover:bg-zinc-700 transition-colors flex shrink-0 shadow-inner"
            >
              <X size={12} strokeWidth={3} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}