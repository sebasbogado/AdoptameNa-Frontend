import { z } from "zod";

export const reportSchema = z.object({
  idUser: z.number(),
  idPost: z.string().optional(),
  idPet: z.string().optional(),
  idComment: z.string().optional(),
  idProduct: z.string().optional(),
  idReportReason: z
    .number({ invalid_type_error: "Debes seleccionar un motivo del reporte" })
    .min(1, "Debes seleccionar un motivo del reporte"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(30, "La descripción no puede tener más de 30 caracteres"),
}).refine((data) => {
  const provided = [data.idPost, data.idPet, data.idComment, data.idProduct].filter(Boolean).length;
  return provided <= 1;
}, {
  message: "Se debe proporcionar solo uno de los siguientes campos: idPost, idPet o idComment",
  path: ["idPost", "idPet", "idComment", "idProduct"],
}
)
