import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

export const DashboardSection = ({ title, children }: DashboardSectionProps) => {
  return (
    <div className='flex flex-col'>
      <h2 className="text-3xl font-semibold mb-4 text-heading">{title}</h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};