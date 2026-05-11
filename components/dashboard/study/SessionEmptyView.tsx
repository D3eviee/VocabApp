import { ArrowLeft } from 'lucide-react'
import Button from '../ui/Button'
import Link from 'next/link'

const SessionEmptyView = ({deckId}:{deckId:string}) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7]">
        <p className="text-gray-500 font-medium mb-6">All for today!</p>
        <Link href={`/dashboard`}>
          <Button variant="primary" className="gap-2 py-3 px-6 rounded-3xl bg-red-400">
            <ArrowLeft size={16} /> Back to dashboard
          </Button>
        </Link>
      </div>
    )
}

export default SessionEmptyView