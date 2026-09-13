import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const BackToDashboardLink = () => {
  return (
    <Link
        href="/dashboard" 
        className="text-main-dark p-1 hover:bg-button-background rounded-lg"
    >
        <ChevronLeft size={22} strokeWidth={2} /> 
    </Link>
  )
}