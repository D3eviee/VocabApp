export const DecksSkeleton = () => {
    return (
        <div className='w-full flex flex-col gap-8'>
            <div className='flex flex-col'>
                <div className="h-7 md:h-6 w-32 bg-gray-200 animate-pulse rounded-md mb-4"></div>
                
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div 
                            key={i} 
                           
                            className="w-full h-45 bg-white border border-gray-100 rounded-4xl animate-pulse"
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-auto"></div>
                                <div className="w-full flex gap-3 mt-6">
                                    <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
                                    <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>  
    );
}