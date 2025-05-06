'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Mode = 'received' | 'sent';

type AdoptionModeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const AdoptionModeContext = createContext<AdoptionModeContextType | undefined>(undefined);

export const AdoptionModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>('received');

  return (
    <AdoptionModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AdoptionModeContext.Provider>
  );
};

export const useAdoptionMode = () => {
  const context = useContext(AdoptionModeContext);
  if (!context) throw new Error('useAdoptionMode must be used within a AdoptionModeProvider');
  return context;
};