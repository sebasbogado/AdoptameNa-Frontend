import { z } from "zod";

export const adoptionSchema = z.object({
  fullname: z
    .string()
    .min(2, "El nombre completo es obligatorio."),
  currentEmail: z
    .string()
    .email("El correo electrónico no es válido."),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "El teléfono debe ser válido (solo números)."),
  commitment: z
    .boolean()
    .refine((val) => val === true, {
      message: "Debes aceptar el compromiso para continuar.",
    }),
});

export type AdoptionFormData = z.infer<typeof adoptionSchema>;
