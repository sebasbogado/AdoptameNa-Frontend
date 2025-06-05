import { z } from "zod";

export const petSchema = z.object({
petStatusId: z.number().min(1, "Selecciona un estado").positive(),
animalId: z.number().min(1, "Selecciona un tipo de animal").positive(),
breedId: z.number().min(1, "Selecciona una raza").positive(),
name: z.string().min(1, "El título debe tener al menos 5 caracteres").max(100),
description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
isVaccinated: z.boolean(),
isSterilized: z.boolean(),
gender: z.enum(["MALE", "FEMALE", "OTHER"]),
addressCoordinates: z
    .tuple([
      z.number().min(-90).max(90, "Latitud inválida"),
      z.number().min(-180).max(180, "Longitud inválida"),
    ])
    .refine(([lat, lng]) => lat !== 0 && lng !== 0, {
      message: "Debe seleccionar una ubicación en el mapa",
    }),
//edad: z.number().min(1, "La edad debe ser mayor a 0").positive(),
//peso: z.number().min(1, "El peso debe ser mayor a 0").positive(),
birthdate: z.string().optional(),
mediaIds: z.array(z.number()).optional(),
hasSensitiveImages: z.boolean().default(false),
});

export type PetFormValues = z.infer<typeof petSchema>;