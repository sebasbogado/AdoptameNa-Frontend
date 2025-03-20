import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(50, "El correo no debe exceder 50 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(255, "La contraseña no debe exceder 20 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
