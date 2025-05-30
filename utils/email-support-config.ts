export const EMAIL_CONFIG = {
    SUPPORT: {
        ADDRESS: 'adoptamena@gmail.com',
        SUBJECT: 'Soporte AdoptameNa',
        BODY: 'Hola,\n\nMe gustaría contactar con soporte por el siguiente motivo:\n\n'
    }
} as const;

export const getSupportEmailLink = () => {
    const { ADDRESS, SUBJECT, BODY } = EMAIL_CONFIG.SUPPORT;
    return `mailto:${ADDRESS}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
}; 