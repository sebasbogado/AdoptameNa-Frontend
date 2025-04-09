import {z} from "zod";

export const petStatusSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(255, "La descripción no puede tener más de 255 caracteres"),
});