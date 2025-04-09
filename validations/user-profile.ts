import * as z from "zod";


export const fullNameSchema = z
  .string()
  .min(3, "El nombre completo debe tener al menos 3 caracteres")
  .max(100, "El nombre completo no puede tener más de 100 caracteres")
  .nonempty("El nombre completo es obligatorio");


export const descriptionSchema = z
  .string()
  .max(500, "La descripción no puede tener más de 500 caracteres")
  .or(z.literal(""))

export const profileEditSchema = z.object({
  description: descriptionSchema,
  fullName: fullNameSchema,
})
export const profileSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'El género debe ser MALE, FEMALE u OTHER'
  })
    .nullable(),

  description: descriptionSchema,
  fullName: fullNameSchema,

  birthdate: z
    .string()
    .nullable()
    .refine(
      (val) => val === null || !isNaN(Date.parse(val)),
      { message: "La fecha debe ser válida o estar vacía" }
    )
    .transform((val) => (val ? new Date(val) : null))
    .refine((date) => date === null || date < new Date(), {
      message: "La fecha de nacimiento no puede ser una después de hoy",
    }),

  phoneNumber: z
    .string()
    .regex(/^\d{9,10}$/, "El número debe tener entre 9 y 10 dígitos numéricos")
    .or(z.literal(""))
    .nullable()
  ,

  addressCoordinates: z
    .tuple([
      z.number().min(-90).max(90, "Latitud inválida"),
      z.number().min(-180).max(180, "Longitud inválida"),
    ])
    .refine(([lat, lng]) => lat !== 0 && lng !== 0, {
      message: "Debe seleccionar una ubicación en el mapa",
    }),

  address: z.string()
    .min(3, 'El address debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9\s,.-]+$/, 'El address solo puede contener letras, números y algunos caracteres especiales (espacio, punto, coma y guion)')
    .max(255, 'El address debe tener máximo 255 caracteres')
    .or(z.literal(""))
    .nullable(),






});

export type ProfileValues = z.infer<typeof profileSchema>;
export type ProfileValuesEdit = z.infer<typeof profileEditSchema>;
