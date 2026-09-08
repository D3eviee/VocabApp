"use client"

import { X } from "lucide-react"

type StudyClientCard ={
  flashcard: any,
  nextFn: () => void
  backFn: () => void
  closeFn: () => void
  activeIndex: number
  activeCard: any
}

export const StudyClientCard = ({backFn, flashcard, nextFn, closeFn, activeIndex, activeCard } : StudyClientCard) => { 
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-20 animate-in slide-in-from-bottom-10 fade-in duration-500 bg-[#F2F2F2]/30 backdrop-blur-xl saturate-150 border-[0.5px] border-[#D4D4D4] shadow-[0_16px_40px_rgba(0,0,0,0.08)] rounded-4xl p-6 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between mb-6">
        <div className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-light uppercase tracking-widest border-[0.5px] border-blue-100/50">
          Part {activeIndex! + 1} of {flashcard.length}
        </div>
        <button 
          onClick={closeFn}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/5 hover:bg-gray-900/10 transition-colors text-gray-500"
        >
          <X size={16} strokeWidth={1.5}/>
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">{activeCard.title}</h2>
        <p className="text-gray-600 text-15 leading-relaxed ">{activeCard.description}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={backFn}
          className="text-sm font-semibold text-gray-500 hover:text-white hover:bg-gray-500 transition-colors px-3 py-1 border rounded-lg cursor-pointer"
        >
            Back
        </button>
        <button 
          onClick={nextFn}
          className="px-3 py-1 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}