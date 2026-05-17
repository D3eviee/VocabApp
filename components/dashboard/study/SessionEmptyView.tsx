import { ArrowLeft, Coffee } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

export const SessionEmptyView = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh md:min-h-full bg-white md:bg-[#F2F2F2] p-4 w-full h-full">
      <div className="w-full max-w-md bg-white md:rounded-4xl md:shadow-xl md:shadow-gray-200/50 md:border border-gray-100 p-8 md:p-12 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500">
       
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
          <div className="relative p-5 bg-linear-to-b from-blue-50 to-blue-100 rounded-3xl shadow-sm border border-blue-200/50">
            <Coffee size={48} strokeWidth={2.5} className="text-[#2B7FFF]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-[#2B2B2B] mb-3 tracking-tight">All Caught Up!</h1>
        <p className="text-[#666] font-medium text-15 mb-10 leading-relaxed max-w-70">You have no cards due for review right now. Enjoy a well-deserved break!</p>
        
        <div className="w-full relative ">
          <Link href={`/dashboard`} className="w-full block">
            <Button variant="secondary" className="w-full justify-center gap-2 py-4 rounded-2xl text-15 font-semibold hover:bg-gray-100 transition-all active:scale-95 shadow-sm">
              <ArrowLeft size={18} /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}