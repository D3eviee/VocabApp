import { getCurrentUser } from '@/lib/auth';
import { DashboardHeaderActions } from './DashboardHeaderActions';

export const DashboardHeader = async () => {
    const user = await getCurrentUser();
    const name = user?.firstName || "student";
    
    return (
        <header className="w-full flex flex-row justify-between items-end mb-8 md:mb-12">
            <div className="flex flex-col gap-1.5">
                <h1 className="heading-primary">Welcome back {name}</h1>
                <p className="subheading">Let's see how you're progressing!</p>
            </div>
            <DashboardHeaderActions />
        </header>
    );
}