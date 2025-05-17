export const formatTimeAgo = (dateInput: string | Date): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    console.error("Invalid date input:", dateInput);
    return "Fecha inválida";
  }
  
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHour / 24);
  const diffInWeek = Math.floor(diffInDay / 7);

  if (diffInWeek >= 1) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (diffInSec < 60) {
    return 'Hace unos segundos';
  } else if (diffInMin < 60) {
    return `Hace ${diffInMin} ${diffInMin === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInHour < 24) {
    return `Hace ${diffInHour} ${diffInHour === 1 ? 'hora' : 'horas'}`;
  } else {
    return `Hace ${diffInDay} ${diffInDay === 1 ? 'día' : 'días'}`;
  }
};

export const formatLongDate = (dateString: string | Date): string => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} de ${month} de ${year}`;
};


export const formatShortDate = (dateString: string | Date): string => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};