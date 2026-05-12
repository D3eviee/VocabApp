import { ReactNode } from 'react';

export type DashboardSummaryItemProps = {
  icon: ReactNode;
  title: string;
  value: string;
  accentColor: string
  secondaryColor: string
};

export const DashboardSummaryItem = ({icon, title, value, accentColor, secondaryColor} : DashboardSummaryItemProps) => {
  return (
    <div className="bg-white p-5 rounded-3xl outline-2 outline-[#EFEEF4] flex items-center gap-5">
        <div className={`p-3 rounded-xl ${accentColor} ${secondaryColor} `}>{icon}</div>
        <div className='flex flex-col'>
          <p className="text-xs text-[#7B7A7F] uppercase tracking-wider font-semibold">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
  );
}