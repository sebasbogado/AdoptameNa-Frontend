"use client";

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundService } from '@/utils/sound-service';

interface SoundToggleProps {
  className?: string;
}

export default function SoundToggle({ className }: SoundToggleProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Inicializar el estado desde el servicio cuando el componente se monta
  useEffect(() => {
    setSoundEnabled(soundService.isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const newState = soundService.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <button
      onClick={toggleSound}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors ${className}`}
      title={soundEnabled ? "Silenciar notificaciones" : "Activar notificaciones"}
    >
      {soundEnabled ? (
        <Volume2 className="h-5 w-5 text-amber-500" />
      ) : (
        <VolumeX className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
}
