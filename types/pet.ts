export interface Pet {
  id: number;
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