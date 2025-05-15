export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
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
export const formatRecentTimeAgo = (dateString: string): string | null => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);

  if (diffInSec < 60) {
    return 'Hace unos segundos';
  } else if (diffInMin < 60) {
    return `Hace ${diffInMin} ${diffInMin === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInHour < 24) {
    return `Hace ${diffInHour} ${diffInHour === 1 ? 'hora' : 'horas'}`;
  }
  else {
    return formatMediumDate(dateString);
  }
 
};
export const formatLongDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} de ${month} de ${year}`;
};


export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatMediumDate = (dateString: string): string => {
  const date = new Date(dateString);

  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};