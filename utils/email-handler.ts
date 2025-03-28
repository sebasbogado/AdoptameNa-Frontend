export const handleContactClick = (destinatario: string, asunto: string, mensaje: string) => {
    const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
    window.location.href = mailtoUrl;
  };