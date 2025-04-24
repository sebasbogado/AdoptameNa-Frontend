import { z } from "zod";

export const productCategorySchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
});

export type ProductCategoryInput = z.infer<typeof productCategorySchema>;
