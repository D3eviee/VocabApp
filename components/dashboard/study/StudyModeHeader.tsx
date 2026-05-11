import { ChevronLeft } from 'lucide-react'
import Link from 'next/link';

const StudyModeHeader = ({currentIndex, cardsCount}:{currentIndex:number, cardsCount:number}) => {
  const progress = (currentIndex/cardsCount) * 100;
  
  return (
    <header className='relative flex items-center justify-between w-full px-4 py-4 md:px-10 md:py-6'>
      <div className="z-10">
        <Link
          href={`/dashboard`}
          className='w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors'
        >
          <ChevronLeft size={24} strokeWidth={2.5} className='pr-0.5'/>
        </Link>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute left-0 right-0 flex flex-col items-center pointer-events-none px-16">
        <div className="text-[10px] md:text-xs font-bold text-green-500 tracking-widest uppercase mb-1">
          {currentIndex + 1} / {cardsCount}
        </div>

        <div className='w-full max-w-37.5 md:max-w-xs rounded-xl h-2 md:h-3 border-[0.5px] border-green-500 overflow-hidden'>
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out rounded-r-2xl" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Pusty div dla balansu flex-between */}
      <div className="w-10 h-10"></div>
    </header>
  )
}

export default StudyModeHeader;