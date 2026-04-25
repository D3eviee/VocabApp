import { Search, X } from 'lucide-react';

type NavbarOptionsProps =  {
  toggleSearch: () => void, 
  toggleProfile: () => void, 
  isSearchOpen: boolean
}

const NavbarOptions = ({toggleSearch, toggleProfile, isSearchOpen }:NavbarOptionsProps) => {
  return (
       <div className="flex items-center gap-4 shrink-0 z-30 relative">
            <button 
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
              <span className="text-13 font-semibold hidden sm:block">
                {isSearchOpen ? 'Close' : 'Search'}
              </span>
            </button>
            
            <button 
              onClick={() => toggleProfile()}
              className="h-7 w-7 rounded-full bg-linear-to-b from-gray-50 to-gray-200 border border-gray-300 flex items-center justify-center text-[11px] font-bold text-gray-800 cursor-pointer hover:shadow-sm transition-shadow shadow-xs"
            >
              HR
            </button>
          </div>
  )
}

export default NavbarOptions