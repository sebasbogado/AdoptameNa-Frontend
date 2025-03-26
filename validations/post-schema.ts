import { z } from "zod";

export const postSchema = z.object({
  postType: z.object({
    id: z.number().min(1, "Seleccione un tipo de publicación"),
  }),
  title: z.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .nonempty("El título es requerido"),
  content: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .nonempty("La descripción es requerida"),
  locationCoordinates: z
    .tuple([
      z.number().min(-90).max(90, "Latitud inválida"),
      z.number().min(-180).max(180, "Longitud inválida"),
    ])
    .refine(([lat, lng]) => lat !== 0 && lng !== 0, {
      message: "Debe seleccionar una ubicación en el mapa",
    }),
  contactNumber: z.string()
    .min(9, "Número inválido (9-15 dígitos)")
    .max(15, "Número inválido (9-15 dígitos)")
    .regex(/^\+?\d{9,15}$/, "Número inválido (9-15 dígitos)"),
    urlPhoto: z.string().optional().default(""),
  sharedCounter: z.number().default(0), // Campo estático con valor 0
  status: z.enum(["activo"]).default("activo"), // Campo estático con valor "activo"
  publicationDate: z.string().default(new Date().toISOString()), // Fecha de publicación con la fecha actual
});

export type PostFormValues = z.infer<typeof postSchema>;