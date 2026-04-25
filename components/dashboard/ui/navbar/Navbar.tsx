"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookMarked } from 'lucide-react';
import NavbarNavigation from './NavbarNavigation';
import NavbarOptions from './NavbarOptions';
import NavbarSearchMenu from './NavbarSearchMenu';
import NavbarProfileMenu from './NavbarProfileMenu';

export default function Navbar() {
  // STATES FOR OPENING SEARCH AND PROFILE NAVBAR MENUS
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSearchOpen(false);
  };

  const closeAllMenus = () => {
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  };

  const isMenuOpen = isSearchOpen || isProfileOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) closeAllMenus();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchOpen, isProfileOpen]);

  return (
    <>
      <div 
        className={`inset-0 z-60 transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible backdrop-blur-md' : 'opacity-0 invisible pointer-events-none backdrop-blur-none' }`} 
        onClick={closeAllMenus}
      />
      
      <nav 
        onMouseLeave={closeAllMenus}
        className={`relative top-0 z-150 transition-colors duration-300 bg-white border-b  ${
          isMenuOpen ?? "backdrop-blur-xl"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between relative">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-gray-900 p-1 rounded-md text-white">
              <BookMarked size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-gray-950 hidden md:block">VocabApp</span>
          </Link>

          <NavbarNavigation />
          
          <NavbarOptions 
            isSearchOpen={isSearchOpen} 
            toggleProfile={toggleProfile} 
            toggleSearch={toggleSearch}
          />
        </div>

        {/* MENUS FOR SEARCH AND PROFILE */}
        <NavbarSearchMenu isSearchOpen={isSearchOpen} />
        <NavbarProfileMenu isProfileOpen={isProfileOpen} />
      </nav>
    </>
  );
}
