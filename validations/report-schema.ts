import { z } from "zod";

export const reportSchema = z.object({
  idUser: z.number(),
  idPost: z.number(),
  idReportReason: z
    .number({ invalid_type_error: "Debes seleccionar un motivo del reporte" })
    .min(1, "Debes seleccionar un motivo del reporte"),
  description: z
    .string()
    .max(255, "La descripción no puede tener más de 255 caracteres"),
  reportDate: z.string(),
  status: z.string(),
});
