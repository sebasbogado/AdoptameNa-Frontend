import { Animal } from "./animal";
import { Breed } from "./breed";
import { Media } from "./media";
import { PetStatus } from "./pet-status";

export interface Pet {
  id: number;
  name: string;
  description: string;
  birthdate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  isSterilized: boolean;
  isVaccinated: boolean;
  addressCoordinates: string;
  userId: number;
  userFullName: string;
  organizationName: string;
  isBanned: boolean;
  sharedCounter: number;
  media: Media[]; 
  animal: Animal;
  breed: Breed;
  petStatus: PetStatus;
  hasSensitiveImages: boolean;
}


export interface CreatePet {
  name: string;
  description: string;
  birthdate: string | undefined;
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
  hasSensitiveImages: boolean;
}

export interface UpdatePet {
  name: string;
  description: string;
  birthdate: string | undefined;
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

export interface RestorePet {
  isDeleted: boolean;
}