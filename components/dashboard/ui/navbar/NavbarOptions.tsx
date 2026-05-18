"use client";
import { User } from 'lucide-react';

type NavbarOptionsProps = {
  firstName: string,
  toggleSearch: () => void;
  toggleProfile: () => void;
  isSearchOpen: boolean;
}

const NavbarOptions = ({ firstName, toggleProfile }: NavbarOptionsProps) => {
  const getInitials = () => {
    if (firstName) {
      const parts = firstName.trim().split(" ");
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return null;
  };

  const initials = getInitials();

  return (
    <div className="flex items-center gap-4 shrink-0 z-30 relative">
      {/* <button 
        onClick={() => toggleSearch()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          isSearchOpen 
            ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-black' 
            : 'bg-black/5 hover:bg-black/10 text-gray-600'
          }`}
          >
            {isSearchOpen ? (
              <X size={15} strokeWidth={2.5} />
            ) : (
              <Search size={15} strokeWidth={2.5} />
            )}
            <span className="text-13 font-semibold hidden sm:block">{isSearchOpen ? 'Close' : 'Search'}</span>
        </button> */}

      <button 
        onClick={toggleProfile}
        className="h-8 w-8 rounded-full bg-linear-to-b from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-13 font-bold text-gray-800 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all shadow-xs active:scale-95 select-none"
      >
        {initials ? initials : <User size={14} className="text-gray-600" />}
      </button>
    </div>
  );
};

export default NavbarOptions;