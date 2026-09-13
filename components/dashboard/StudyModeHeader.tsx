import { BackToDashboardLink } from './ui/BackToDashboardLink';

export const StudyModeHeader = ({count, currentIndex}:{count:number, currentIndex:number}) => {
  return (
    <div className="w-full top-0 p-2 shrink-0 bg-main-light shadow-sm z-50">
      <div className='max-w-5xl mx-auto flex items-center justify-between'>
        <BackToDashboardLink/>

        <p className='text-main-dark text-sm leading-none tracking-wider font-semibold'>{currentIndex+1}/{count}</p>
      </div>
    </div>
  )
}