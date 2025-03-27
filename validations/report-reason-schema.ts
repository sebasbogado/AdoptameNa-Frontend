import { z } from "zod";

export const reportReasonSchema = z.object({
  id: z.number().optional(),
  reason: z.string().min(1,"Debe contener una descripcion").max(250,"Descripcion maxima de 250 caracteres"),
});