export type Sponsor = {
  id: number;
  idUser: number;
  organizationName: string;
  fullName: string;
  reason: string;
  contact: string;
  logoId: number | null; // Hacer opcional/nullable
  bannerId: number | null; // Hacer opcional/nullable
  isActive: boolean;
};

// Nuevo tipo para sponsors activos
export type ActiveSponsor = {
  id: number;
  organizationName: string;
  logoUrl: string;
  bannerUrl: string;
  logoId: number;
  bannerId: number;
};

// Tipo para la creación de sponsors
export type CreateSponsorRequest = {
  contact: string;
  reason: string;
  logoId?: number;
  bannerId?: number;
};
