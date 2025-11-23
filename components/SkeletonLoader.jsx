/**
 * Skeleton loader para PropertyCard
 * Grug gosta: componente simples, animação CSS pura
 */
export const SkeletonLoader = ({ count = 1, className = '' }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className={`bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse ${className}`}
                >
                    <div className="aspect-[4/5] bg-gray-200" />
                    <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-20" />
                            <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};




