import { getCurrentUser } from '@/lib/auth';
import { DashboardHeaderActions } from './DashboardHeaderActions';

export const DashboardHeader = async () => {
    const user = await getCurrentUser();
    const name = user?.firstName || "student";
    
    return (
        <header className="w-full flex flex-row justify-between items-end mb-8 md:mb-12">
            <div className='flex flex-col'>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#333]">
                    Welcome back {name}
                </h1>
                <p className="text-15 md:text-base md:mt-1 text-[#494949]">
                    Let's see how you're progressing!
                </p>
            </div>
            
            <DashboardHeaderActions />
        </header>
    );
}