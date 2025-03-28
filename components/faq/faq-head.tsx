// components/FAQCategory.tsx
import React from 'react';


interface FAQHeadProps {
  title: string;
  children: React.ReactNode; 
}

const FAQHead: React.FC<FAQHeadProps> = ({ title, children }) => {
  return (
    <div className="mt-6">
      <details className='w-[1161px] group'>
        <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'>
          <span>{title}</span>
          <span className="ml-2 text-xl material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>
            keyboard_arrow_down
          </span>
        </summary>
        <div className="pl-4">
          {children}
        </div>
      </details>
    </div>
  );
};

export default FAQHead;
