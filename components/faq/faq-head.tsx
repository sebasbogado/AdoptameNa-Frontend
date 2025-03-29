// components/FAQCategory.tsx
import React from 'react';


interface FAQHeadProps {
  title: string;
  children: React.ReactNode; 
  isOpen: boolean;
  onToggle: () => void;
}

const FAQHead: React.FC<FAQHeadProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="mt-6">
      <div>
        <summary 
          className='text-2xl font-bold flex justify-between items-center cursor-pointer'
          onClick={onToggle} // Controla el estado del acordeón con el clic
        >
          <span>{title}</span>
          <span className="ml-2 material-symbols-outlined transition-transform transform" style={{fontSize: 48}}>
            {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} {/* Cambiar icono según estado */}
          </span>
        </summary>
        {isOpen && (
          <div className="pl-4">
            {children} {/* Mostrar contenido solo si está abierto */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQHead;
