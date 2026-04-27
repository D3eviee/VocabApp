import { ArrowLeft, BrainCircuit } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

const SessionEndView = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7]">
            <div className="p-6 bg-green-100 text-green-600 rounded-full mb-6">
            <BrainCircuit size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Session Complete!</h1>
            <p className="text-gray-500 font-medium mb-8">You've reviewed all cards for now.</p>
            <Link href={`/dashboard`}>
                <Button variant="secondary" className="gap-2">
                    <ArrowLeft size={16} /> Back to Deck
                </Button>
            </Link>
        </div>
    )
}

export default SessionEndView