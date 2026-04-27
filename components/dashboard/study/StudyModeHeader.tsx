import { ChevronLeft } from 'lucide-react'
import Link from 'next/link';

const StudyModeHeader = ({currentIndex, cardsCount}:{currentIndex:number, cardsCount:number}) => {
  const progress = (currentIndex/cardsCount) * 100;
  
  return (
    <header className='relative flex flex-row w-full px-10 py-6'>
      {/* BACK BUTTON */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard`}
          className='p-1 rounded-2xl bg-[#333] flex items-center justify-center'
        >
          <ChevronLeft size={28} strokeWidth={2} className='mr-0.5'/>
        </Link>
      </div>

      {/* BACK BUTTON */}
      <div className="absolute w-1/2 left-1/2 flex flex-col items-center top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="text-xs font-bold text-[#2B2B2B] tracking-widest uppercase mb-1">{currentIndex + 1} / {cardsCount}</div>

        <div className='relative w-full rounded-xl h-3 border-[0.5px] border-[#2B2B2B]'>
          <div 
            className="h-full bg-[#2B2B2B] transition-all duration-300 ease-out rounded-2xl" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
      </div>
      </header>
    )
}

export default StudyModeHeader