import { ChevronLeft } from 'lucide-react'
import Link from 'next/link';

export const StudyModeHeader = ({deckTitle}:{deckTitle: string}) => {
  console.log(deckTitle)
  return (
          <div className="top-0 p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] border-b lg:border-none border-gray-100">
        <Link
          href="/dashboard" 
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={22} color="#2B7FFF"/> 
        </Link>

        <p className="text-[#2B2B2B] font-bold">{deckTitle}</p>
      </div>
  )
}