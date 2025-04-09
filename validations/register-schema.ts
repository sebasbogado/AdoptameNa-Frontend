import { z } from "zod";

export const baseSchema = z.object({
  fullName: z
    .string()
    .min(5, "Nombre inválido (Máx. 50 caracteres, min. 5)")
    .max(50, "Nombre inválido (Máx. 50 caracteres, min. 5)"),
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener menos de 64 caracteres"),
  confirmPassword: z.string(),
});

export const organizacionSchema = baseSchema.extend({
  organizationName: z
    .string()
    .min(5, "Nombre de la organización inválido (Máx. 50 caracteres, min. 5)")
    .max(50, "Nombre de la organización inválido (Máx. 50 caracteres, min. 5)"),
});

const addPasswordRefinements = (schema: z.ZodTypeAny) => {
  return schema
    .refine((data) => data.password === data.confirmPassword, {
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
};

export const refinedBaseSchema = addPasswordRefinements(baseSchema);

export const refinedOrganizacionSchema =
  addPasswordRefinements(organizacionSchema);
