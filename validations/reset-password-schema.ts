import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener menos de 64 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})
.refine((data) => /[a-z]/.test(data.password), {
  message: "La contraseña debe tener al menos una letra minúscula",
  path: ["password"],
})
.refine((data) => /[A-Z]/.test(data.password), {
  message: "La contraseña debe tener al menos una letra mayúscula",
  path: ["password"],
})
.refine((data) => /[0-9]/.test(data.password), {
  message: "La contraseña debe tener al menos un número",
  path: ["password"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
