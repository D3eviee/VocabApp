import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  icon: ReactNode;
  textColor:string
}

export const SectionHeader = ({ title, icon, textColor }: SectionHeaderProps) => {
  return (
    <div className="absolute px-1.5 left-6 -top-3 flex flex-row items-center gap-2 bg-secondary-light">
      <div>{icon}</div>
      <h2 className={`text-15 font-semibold ${textColor}`}>{title}</h2>
    </div>
  )
}