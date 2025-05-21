import { POST_TYPEID } from "@/types/constants";
import { z } from "zod";
export const MAX_TAGS = 5;

export const postSchema = z.object({
  postTypeId: z.number().min(1, "Seleccione un tipo de publicación"),
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
    .optional(),
 contactNumber: z
  .string()
  .optional()
  .refine(
    (val) => !val || (/^\d{5,20}$/.test(val)),
    {
      message: "El número de contacto debe tener entre 5 y 20 dígitos numéricos.",
    }
  ),
  mediaIds: z.array(z.number()).optional(),
  tagIds: z
    .array(z.number())
    .max(MAX_TAGS, `Máximo ${MAX_TAGS} tags permitidos`)
    .optional(),
}).superRefine((data, ctx) => {
  // Si NO es blog, locationCoordinates es obligatorio y válido
  if (data.postTypeId !== POST_TYPEID.BLOG) {
    if (!data.locationCoordinates) {
      ctx.addIssue({
        path: ["locationCoordinates"],
        code: z.ZodIssueCode.custom,
        message: "Debe seleccionar una ubicación en el mapa",
      });
    } else {
      const [lat, lng] = data.locationCoordinates;
      if (lat === 0 || lng === 0) {
        ctx.addIssue({
          path: ["locationCoordinates"],
          code: z.ZodIssueCode.custom,
          message: "Debe seleccionar una ubicación en el mapa",
        });
      }
    }
    if (!data.contactNumber) {
      ctx.addIssue({
        path: ["contactNumber"],
        code: z.ZodIssueCode.custom,
        message: "El número de contacto es requerido",
      });
    }
  }
  // Si es blog, los campos pueden ser omitidos
});

export type PostFormValues = z.infer<typeof postSchema>;