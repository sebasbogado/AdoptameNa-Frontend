import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationClassNames {
    container?: string;
    navButton?: string;
    navButtonActive?: string;
    navButtonDisabled?: string;
    pageItem?: string;
    pageItemActive?: string;
    pageItemInactive?: string;
    pageItemDots?: string;
    pageNumbersContainer?: string;
}

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    size?: PaginationSize;
    classNames?: PaginationClassNames;
    showText?: boolean;
    prevText?: string;
    nextText?: string;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
    size = 'md',
    classNames = {},
    showText = true,
    prevText = 'Anterior',
    nextText = 'Siguiente',
    maxVisiblePages = 7,
}) => {
    if (totalPages === 0) return null;

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    navButton: 'px-2 py-1 text-xs min-w-[80px]',
                    pageItem: 'w-7 h-7 text-xs',
                    icon: 'w-3 h-3'
                };
            case 'lg':
                return {
                    navButton: 'px-4 py-3 text-base min-w-[120px]',
                    pageItem: 'w-12 h-12 text-base',
                    icon: 'w-6 h-6'
                };
            case 'md':
            default:
                return {
                    navButton: 'px-3 py-2 text-sm min-w-[100px]',
                    pageItem: 'w-10 h-10 text-sm',
                    icon: 'w-5 h-5'
                };
        }
    };

    const sizeClasses = getSizeClasses();

    return (
        <nav
            className={`flex items-center justify-center my-8 ${classNames.container || ''}`}
            aria-label="Paginación"
        >
            <ul className="flex flex-wrap items-center gap-1 md:gap-2">
                {totalPages > 1 && (
                    <li className="mx-0.5">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`flex items-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 justify-center ${sizeClasses.navButton} ${currentPage === 1
                                ? `text-gray-400 cursor-not-allowed bg-gray-100 ${classNames.navButtonDisabled || ''}`
                                : `text-gray-700 hover:bg-purple-100 hover:text-purple-600 bg-white ${classNames.navButtonActive || ''}`
                                } ${classNames.navButton || ''}`}
                            aria-label="Ir a la página anterior"
                        >
                            <ChevronLeft className={`${sizeClasses.icon} mr-1`} />
                            {showText && prevText}
                        </button>
                    </li>
                )}

                {/* Números de página */}
                <div className={`flex items-center ${classNames.pageNumbersContainer || ''}`}>
                    {pageNumbers.map((page, index) => (
                        <li key={index} className="mx-0.5">
                            {page === '...' ? (
                                <span
                                    className={`flex items-center justify-center rounded-md ${sizeClasses.pageItem} text-gray-500 bg-white ${classNames.pageItemDots || ''}`}
                                    aria-hidden="true"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    onClick={() => typeof page === 'number' && onPageChange(page)}
                                    className={`flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${sizeClasses.pageItem} ${currentPage === page
                                        ? `bg-purple-500 text-white font-medium hover:bg-purple-600 ${classNames.pageItemActive || ''}`
                                        : `text-gray-700 hover:bg-purple-50 hover:text-purple-600 bg-white ${classNames.pageItemInactive || ''}`
                                        } ${classNames.pageItem || ''}`}
                                    aria-label={`Ir a la página ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}
                </div>

                {totalPages > 1 && (
                    <li className="mx-0.5">
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`flex items-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 justify-center ${sizeClasses.navButton} ${currentPage === totalPages
                                ? `text-gray-400 cursor-not-allowed bg-gray-100 ${classNames.navButtonDisabled || ''}`
                                : `text-gray-700 hover:bg-purple-50 hover:text-purple-600 bg-white ${classNames.navButtonActive || ''}`
                                } ${classNames.navButton || ''}`}
                            aria-label="Ir a la página siguiente"
                        >
                            {showText && nextText}
                            <ChevronRight className={`${sizeClasses.icon} ml-1`} />
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;