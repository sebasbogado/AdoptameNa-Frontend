"use client";

import { getSounds } from "./sounds.http";

/**
 * Servicio para manejar la reproducción de sonidos de notificaciones y mensajes
 */
export class SoundService {
  private static instance: SoundService;
  private notificationSound: HTMLAudioElement | null = null;
  private messageSound: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private notificationSoundUrl: string = '/sounds/notification.mp3';
  private messageSoundUrl: string = '/sounds/message.mp3';
  private authToken: string | null = null;
  private loaded: boolean = false;
  
  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.notificationSound = new Audio(this.notificationSoundUrl);
        this.messageSound = new Audio(this.messageSoundUrl);
        
        const soundEnabled = localStorage.getItem('soundEnabled');
        this.enabled = soundEnabled !== 'false';
        
        this.notificationSound.load();
        this.messageSound.load();
      } catch (error) {
        console.error('Error al inicializar sonidos:', error);
      }
    }
  }

  /**
   * Devuelve la instancia única del servicio
   */
  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }
  
  /**
   * Configura el token de autenticación y carga los sonidos del servidor
   */
  public setAuthToken(token: string | null): Promise<void> {
    this.authToken = token;
    if (token) {
      return this.loadSoundsFromServer();
    }
    return Promise.resolve();
  }

  /**
   * Carga los sonidos desde el servidor
   */
  public async loadSoundsFromServer(): Promise<void> {
    if (!this.authToken) return;
    
    try {
      const { notificationSound, messageSound } = await getSounds(this.authToken);
      
      if (typeof window !== 'undefined') {
        // Actualizar sonido de notificación si está disponible
        if (notificationSound && notificationSound.url) {
          this.notificationSound = new Audio(notificationSound.url);
          this.notificationSoundUrl = notificationSound.url;
          this.notificationSound.load();
        }
        
        // Actualizar sonido de mensaje si está disponible
        if (messageSound && messageSound.url) {
          this.messageSound = new Audio(messageSound.url);
          this.messageSoundUrl = messageSound.url;
          this.messageSound.load();
        }
        
        this.loaded = true;
      }
    } catch (error) {
      console.error('Error al cargar sonidos desde el servidor:', error);
    }
  }

  /**
   * Reproduce el sonido de notificación
   */
  public playNotificationSound(): void {
    if (!this.enabled) return;
    
    try {
      // Si estamos en el navegador, reproducir el sonido
      if (typeof window !== 'undefined') {
        // Reiniciamos el audio para asegurar que se reproduzca cada vez
        if (this.notificationSound) {
          this.notificationSound.currentTime = 0;
          const playPromise = this.notificationSound.play();
          
          // Manejar la promesa para evitar errores en la consola
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Reproducción automática bloqueada o error
              console.error('Error al reproducir sonido de notificación:', error);
              
              // Intentar con un nuevo objeto de audio (puede resolver problemas de interacción)
              const tempAudio = new Audio(this.notificationSoundUrl);
              tempAudio.play().catch(err => {
                console.error('Error al reproducir sonido de notificación (retry):', err);
              });
            });
          }
        } else {
          // Fallback si el audio no se cargó correctamente
          const tempAudio = new Audio(this.notificationSoundUrl);
          tempAudio.play().catch(error => {
            console.error('Error al reproducir sonido de notificación (fallback):', error);
          });
        }
      }
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  }

  /**
   * Reproduce el sonido de mensaje
   */
  public playMessageSound(): void {
    if (!this.enabled) return;
    
    try {
      // Si estamos en el navegador, reproducir el sonido
      if (typeof window !== 'undefined') {
        // Reiniciamos el audio para asegurar que se reproduzca cada vez
        if (this.messageSound) {
          this.messageSound.currentTime = 0;
          const playPromise = this.messageSound.play();
          
          // Manejar la promesa para evitar errores en la consola
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Reproducción automática bloqueada o error
              console.error('Error al reproducir sonido de mensaje:', error);
              
              // Intentar con un nuevo objeto de audio (puede resolver problemas de interacción)
              const tempAudio = new Audio(this.messageSoundUrl);
              tempAudio.play().catch(err => {
                console.error('Error al reproducir sonido de mensaje (retry):', err);
              });
            });
          }
        } else {
          // Fallback si el audio no se cargó correctamente
          const tempAudio = new Audio(this.messageSoundUrl);
          tempAudio.play().catch(error => {
            console.error('Error al reproducir sonido de mensaje (fallback):', error);
          });
        }
      }
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  }

  /**
   * Activa o desactiva todos los sonidos
   */
  public toggleSound(enabled?: boolean): boolean {
    if (enabled !== undefined) {
      this.enabled = enabled;
    } else {
      this.enabled = !this.enabled;
    }
    
    // Guardar configuración
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEnabled', this.enabled.toString());
    }
    
    return this.enabled;
  }

  /**
   * Verifica si el sonido está activado
   */
  public isSoundEnabled(): boolean {
    return this.enabled;
  }
}

// Exportar una instancia para uso global
export const soundService = SoundService.getInstance();
