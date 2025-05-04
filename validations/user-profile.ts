import * as z from "zod";

export const fullNameSchema = z
  .string()
  .min(3, "El nombre completo debe tener al menos 3 caracteres")
  .max(100, "El nombre completo no puede tener más de 100 caracteres")
  .nonempty("El nombre completo es obligatorio");

export const descriptionSchema = z
  .string()
  .max(500, "La descripción no puede tener más de 500 caracteres")
  .or(z.literal(""));

export const profileEditSchema = z.object({
  description: descriptionSchema,
  fullName: fullNameSchema,

  phoneNumber: z
    .string()
    .regex(/^\d{9,10}$/, "El número debe tener entre 9 y 10 dígitos numéricos")
    .or(z.literal(""))
    .nullable(),
  address: z
    .string()
    .min(3, "El address debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9\s,áéíóúÁÉÍÓÚñÑ.-]+$/,
      "El address solo puede contener letras, números, acentos y algunos caracteres especiales (espacio, punto, coma y guion)"
    )
    .max(255, "El address debe tener máximo 255 caracteres")
    .or(z.literal(""))
    .nullable(),
});
export const profileSchema = z.object({
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      message: "El género debe ser MALE, FEMALE u OTHER",
    })
    .nullable(),

  description: descriptionSchema,
  fullName: fullNameSchema,
  organizationName: z
    .string()
    .min(3, "El nombre de la organización debe tener al menos 3 caracteres")
    .max(
      100,
      "El nombre de la organización no puede tener más de 100 caracteres"
    )
    .optional(),

  birthdate: z
    .string()
    .nullable()
    .refine(
      (val) => val === null || val.trim() === "" || !isNaN(Date.parse(val)),
      { message: "La fecha debe ser válida o estar vacía" }
    )
    .transform((val) => (val && val.trim() !== "" ? new Date(val) : null))
    .refine((date) => date === null || date < new Date(), {
      message: "La fecha de nacimiento no puede ser una después de hoy",
    }),

  phoneNumber: z
    .string()
    .regex(/^\d{9,10}$/, "El número debe tener entre 9 y 10 dígitos numéricos")
    .or(z.literal(""))
    .nullable(),
  addressCoordinates: z
    .array(z.number())
    .length(2, "Las coordenadas deben tener latitud y longitud")
    .optional(),

  address: z
    .string()
    .min(3, "El address debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9\s,áéíóúÁÉÍÓÚñÑ.-]+$/,
      "El address solo puede contener letras, números, acentos y algunos caracteres especiales (espacio, punto, coma y guion)"
    )
    .max(255, "El address debe tener máximo 255 caracteres")
    .or(z.literal(""))
    .nullable(),

  departmentId: z.string().optional(),
  districtId: z.string().optional(),
  neighborhoodId: z.string().optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
export type ProfileValuesEdit = z.infer<typeof profileEditSchema>;
