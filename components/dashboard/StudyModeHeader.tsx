import { ChevronLeft } from 'lucide-react'
import Link from 'next/link';

export const StudyModeHeader = () => {
  return (
    <div className="w-full top-0 p-2 shrink-0 bg-white lg:bg-[#F2F2F2] border-b lg:border-none border-gray-100">
      <div className='max-w-5xl mx-auto flex items-center justify-between'>
        <Link
          href="/dashboard" 
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={22} color="#2B7FFF"/> 
        </Link>
      </div>
    </div>
  )
}