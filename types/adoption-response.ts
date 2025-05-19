import { Pet } from "./pet"

export type AdoptionResponse = {
  id: number
  petId: number
  pet: Pet
  userId: number
  fullName: string
  email: string
  phone: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  createdAt: string
  ownerId: number
  ownerName: string
}
