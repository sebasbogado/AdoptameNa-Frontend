import { Animal } from "./animal";

export interface Pet {
  id: number;
  name: string;
  description: string;
  birthdate: string;
  gender: "MALE" | "FEMALE";
  isSterilized: boolean;
  isVaccinated: boolean;
  addressCoordinates: string;
  userId: number;
  userFullName: string;
  isBanned: boolean;
  media: any[]; 

  animal: {
    id: number;
    name: string;
  };

  breed: {
    id: number;
    name: string;
    animalId: number;
  };

  petStatus: {
    id: number;
    name: string; // Ej: "Perdido", "Encontrado"
    description: string;
  };
}


export interface CreatePet {
  name: string;
  description: string;
  birthdate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  mediaIds: number[];
  isSterilized: boolean;
  isVaccinated: boolean;
  addressCoordinates: string;
  userId: number;
  animalId: number;
  breedId: number;
  //healthStateId: number;
  petStatusId: number;
}

export interface UpdatePet {
  animalId: number;
  birthdate: string;
  breedId: number;
  description: string;
  gender: "MALE" | "FEMALE";
  healthStateId: number;
  isSterilized: boolean;
  isVaccinated: boolean;
  name: string;
  petStatusId: number;
  urlPhoto: string | null;
  userId: number;
  addressCoordinates: string;
}