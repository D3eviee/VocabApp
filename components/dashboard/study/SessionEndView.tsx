import { ArrowLeft, BrainCircuit } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

const SessionEndView = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7]">
            <div className="p-4 bg-green-100 text-green-600 rounded-full mb-6">
                <BrainCircuit size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-[#2B2B2B] mb-1">Session Complete!</h1>
            <p className="text-[#777] font-medium text-sm mb-6">You've reviewed all cards for now.</p>
            <Link href={`/dashboard`}>
                <Button variant="secondary" className="gap-2 px-4 py-3">
                    <ArrowLeft size={16} /> Back to Deck
                </Button>
            </Link>
        </div>
    )
}

export default SessionEndView