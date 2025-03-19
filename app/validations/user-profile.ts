import * as z from "zod";


export const fullNameSchema = z
  .string()
  .min(3, "El nombre completo debe tener al menos 3 caracteres")
  .max(100, "El nombre completo no puede tener más de 100 caracteres")
  .nonempty("El nombre completo es obligatorio");


export const descriptionSchema = z
  .string()
  .max(500, "La descripción no puede tener más de 500 caracteres")
  .optional()
  .or(z.literal(""));



export const profileSchema = z.object({
  description: descriptionSchema,
  fullName: fullNameSchema,
});

export type ProfileValues = z.infer<typeof profileSchema>;
