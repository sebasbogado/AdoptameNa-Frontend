import { z } from "zod";
import { ProductCondition } from "@/types/product-condition";
//campos obligatorios: title, precio, categoria, condicion, usuario
export const productSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").nonempty("El título es requerido"),
  content: z.string(),
  locationCoordinates: z
    .tuple([
      z.number().min(-90).max(90, "Latitud inválida"),
      z.number().min(-180).max(180, "Longitud inválida"),
    ]),
  contactNumber: z.string()
    .min(9, "Número inválido (9-15 dígitos)")
    .max(15, "Número inválido (9-15 dígitos)")
    .regex(/^\+?\d{9,15}$/, "Número inválido (9-15 dígitos)"),
  //mediaIds []
  userId: z.number(),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  categoryId: z.number(),
  animalsId: z.array(z.number()).min(1, "Debe seleccionar al menos un tipo de animal"), //array
  condition: z.nativeEnum(ProductCondition, {
    errorMap: () => ({ message: "Debe seleccionar una condición válida" })
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;