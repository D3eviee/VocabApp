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
    <div className="bg-white p-5 rounded-4xl outline-2 outline-light-border flex items-center gap-4">
        <div className={`p-3 rounded-xl ${accentColor} ${secondaryColor} border-[0.5px] border-[${accentColor}]`}>{icon}</div>
        <div className='flex flex-col gap-2'>
          <p className="uppercase text-xs text-subheading leading-none">{title}</p>
          <p className="text-2xl font-semibold text-heading leading-none">{value}</p>
        </div>
      </div>
  );
}