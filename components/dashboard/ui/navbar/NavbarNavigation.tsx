import Link from 'next/link'
import { usePathname } from 'next/navigation';

const NavbarNavigation = () => {
  const pathname = usePathname();
  const isStats = pathname === '/dashboard/statistics';
    
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <div className="relative flex bg-gray-100/80 p-0.5 rounded-full border border-gray-200/50 shadow-inner">
        <div
          className={`absolute top-0.5 bottom-0.5 left-0.5 w-16 bg-white rounded-full shadow-sm transition-transform duration-300 ease-out ${
            isStats ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
          <Link
            href="/dashboard"
            className={`relative z-10 w-16 text-center py-1 rounded-full text-13 font-semibold transition-colors duration-300 ${
              !isStats ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Decks
          </Link>
          <Link
            href="/dashboard/statistics"
            className={`relative z-10 w-16 text-center py-1 rounded-full text-13 font-semibold transition-colors duration-300 ${
              isStats ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Stats
          </Link>
        </div>
    </div>
  )
}

export default NavbarNavigation