import { Animal } from "./animal";
import { Media } from "./media";

export interface Pet {
  id: number;
  animal: Animal;
  birthdate: string;
  breedId: number;
  description: string;
  gender: "MALE" | "FEMALE";
  healthStateId: number;
  isSterilized: boolean;
  isVaccinated: boolean;
  name: string;
  petStatusId: number;
  media: Media[];
  userId: number;
  addressCoordinates: string;
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
  petStatusId: number
}