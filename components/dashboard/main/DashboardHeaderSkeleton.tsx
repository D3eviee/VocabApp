export const DashboardHeaderSkeleton = () => {
    return (
        <header className="w-full flex flex-row justify-between items-end mb-8 md:mb-12">
            <div className='flex flex-col'>
                <div className="h-8 md:h-9 w-52 md:w-72 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-5 md:h-6 w-40 md:w-56 bg-gray-200 animate-pulse rounded-md mt-2 md:mt-3"></div>
            </div>

            <div className="hidden md:flex items-center gap-3 h-full mt-0">
                <div className="h-9.5 w-29 bg-gray-200 animate-pulse rounded-xl"></div>
                <div className="h-9.5 w-29 bg-gray-200 animate-pulse rounded-xl"></div>
            </div>
        </header>
    );
}