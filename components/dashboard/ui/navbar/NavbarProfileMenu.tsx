"use client";
import { logoutAction } from '@/app/actions/auth';
import { Settings, CircleUser } from 'lucide-react';

export default function NavbarProfileMenu({isProfileOpen}:{isProfileOpen: boolean}) {
  return(
    <div 
      className={`absolute top-full left-0 w-full grid transition-all duration-300 ease-out bg-white backdrop-blur-md ${
        isProfileOpen 
          ? 'grid-rows-[1fr] opacity-100 border-b border-gray-200/60 pointer-events-auto' 
          : 'grid-rows-[0fr] opacity-0 border-transparent pointer-events-none'
        }`}
    >
      <div className="overflow-hidden relative z-10">
        <div className="h-px w-full bg-gray-100 absolute top-0"/>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
          <h3 className="text-13 font-medium text-gray-500 tracking-tight">My Profile</h3>
          <ul className="flex flex-col gap-5">
            <li>
              <button className="flex items-center gap-4 text-13 font-semibold text-gray-900 hover:text-blue-600 transition-colors group">
                <Settings size={18} strokeWidth={1.5} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                Account
              </button>
            </li>
            <li>
              <button 
                className="flex items-center gap-4 text-13 font-semibold text-gray-900 hover:text-red-600 transition-colors group"
                onClick={logoutAction}
              >
                <CircleUser size={18} strokeWidth={1.5} className="text-gray-500 group-hover:text-red-600 transition-colors" />
                Sign out Hipolit
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}