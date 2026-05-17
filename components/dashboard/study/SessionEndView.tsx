import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

export const SessionEndView = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-dvh md:min-h-full bg-white md:bg-[#F2F2F2] p-4 w-full h-full">
            <div className="w-full max-w-md bg-white md:rounded-4xl md:shadow-xl md:shadow-gray-200/50 md:border border-gray-100 p-8 md:p-12 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500 slide-in-from-bottom-4">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-green-400 blur-2xl opacity-30 animate-pulse rounded-full" />
                    <div className="relative p-5 bg-linear-to-b from-green-50 to-green-100 rounded-3xl shadow-sm border border-green-200/50">
                        <CheckCircle2 size={48} strokeWidth={2.5} className="text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-[#2B2B2B] mb-3 tracking-tight">Session Complete!</h1>
                <p className="text-[#666] font-medium text-15 mb-10 leading-relaxed max-w-70">Great job! You've reviewed all your due cards for now. Your brain is getting stronger.</p>

                <div className="w-full relative">
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