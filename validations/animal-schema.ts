import { z } from "zod";

export const animalSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
});
