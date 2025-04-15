import { z } from "zod";

export const reportSchema = z.object({
  idUser: z.number(),
  idPost: z.string(),
  idPet: z.string(),
  idReportReason: z
    .number({ invalid_type_error: "Debes seleccionar un motivo del reporte" })
    .min(1, "Debes seleccionar un motivo del reporte"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(255, "La descripción no puede tener más de 255 caracteres"),
}).refine(
  data => (data.idPost !== "" && data.idPet === "") || (data.idPet !== "" && data.idPost === ""),
  {
    message: "Debes proporcionar idPost o idPet, pero no ambos",
    path: ["idPost"]
  }
)
