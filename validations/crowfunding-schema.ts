import { z } from "zod";

export const crowdfundingSchema = z.object({
    title: z
        .string()
        .min(3, "El título debe tener al menos 3 caracteres.")
        .max(255, "El título no debe exceder 255 caracteres."),
    description: z
        .string()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(1000, "La descripción no debe exceder 1000 caracteres."),
    goal: z
        .number()
        .min(0.01, "La meta debe ser mayor a 0"),
    durationDays: z
        .union([z.number().min(1).max(365), z.undefined()])
        .optional(), // <-- hace que no sea requerido al editar
});
