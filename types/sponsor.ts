export type Sponsor = {
  id: number;
  // Campos existentes (pueden venir de otra llamada o estar obsoletos?)
  // organizationName: string;
  // logoUrl: string; 
  // bannerUrl: string;
  
  // Campos de la respuesta de getAllSponsors
  idUser: number;
  reason: string;
  contact: string;
  logoId: number | null; // Hacer opcional/nullable
  bannerId: number | null; // Hacer opcional/nullable
  isActive: boolean;
};

