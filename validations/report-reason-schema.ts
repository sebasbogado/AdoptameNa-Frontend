import { z } from "zod";

export const reportReasonSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1,"Debe contener una descripcion").max(30,"Descripcion maxima de 30 caracteres"),
});