
import * as z from "zod";

export const donationSchema = z.object({
  name: z
    .string()
    .min(2, "Por favor, ingresa un nombre válido.")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "Solo se permiten letras y espacios.")
    .optional(),
  amount: z
    .number({
      required_error: "Por favor, ingresa un monto válido.",
      invalid_type_error: "El monto debe ser un número.",
    })
    .min(1, "Por favor, ingresa un monto mayor a 0."),
});


export type DonationFormData = z.infer<typeof donationSchema>;
