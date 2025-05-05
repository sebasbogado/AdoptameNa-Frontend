'use client';

import { useAdoptionMode } from '@/contexts/adoption-mode-context';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function NavbarReceivedRequest() {
  const { mode, setMode } = useAdoptionMode();
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeChange = (newMode: 'received' | 'sent') => {
    setMode(newMode);
    setDropdownOpen(false);
    if (!pathname.includes('/profile/received-request/adoption')) {
      router.push('/profile/received-request/adoption');
    }
  };


  const showModeLabel = pathname.includes('/profile/received-request/adoption');
  const modeLabel = mode === 'received' ? 'Recibidas' : 'Enviadas';

  // ✅ Mostrar solo en esta ruta
  if (!pathname.startsWith('/profile/received-request')) {
    return null;
  }

  return (
    <div className="relative hidden md:flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center text-lg font-bold hover:text-purple-600 focus:outline-none"
      >
        Adopciones
        {showModeLabel && (
          <span className="ml-2 text-sm text-gray-500">({modeLabel})</span>
        )}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <button
            onClick={() => handleModeChange('received')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              mode === 'received'
                ? 'bg-gray-100 text-purple-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Recibidas
          </button>
          <button
            onClick={() => handleModeChange('sent')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              mode === 'sent'
                ? 'bg-gray-100 text-purple-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Enviadas
          </button>
        </div>
      )}
    </div>
  );
}