import { ReactNode } from "react"

const SectionHeader = ({title, icon, bgColor}:{title:string, icon:ReactNode, bgColor:string}) => {
  return (
    <div className="flex items-center gap-3 mb-4">
        <div className={`p-1.5 ${bgColor} rounded-lg text-white`}>{icon}</div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  )
}

export default SectionHeader