interface SkeletonTableProps {
    columns: number;
    rows?: number;
    showHeader?: boolean;
    className?: string;
}

export function SkeletonTable({ 
    columns, 
    rows = 5, 
    showHeader = true,
    className = ""
}: SkeletonTableProps) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse border text-sm">
                {showHeader && (
                    <thead>
                        <tr className="bg-gray-50">
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="border px-3 py-2 text-left">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="border px-3 py-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 