"use client";

import { MoveDown } from 'lucide-react';
import React from 'react';

interface ScrollToBottomButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ 
  onClick, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  return (
    <div className={`sticky bottom-4 left-0 right-0 flex justify-end px-4 pointer-events-none ${className}`}>
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} bg-[var(--color-primary-brand-color)] text-white rounded-full shadow-lg hover:bg-purple-600 transition-all flex items-center pointer-events-auto`}
      >
        <span>Ir abajo</span>
        <MoveDown size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
      </button>
    </div>
  );
};

export default ScrollToBottomButton;
