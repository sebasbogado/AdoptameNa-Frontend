import { z } from "zod";

export const petSchema = z.object({
estado: z.number().min(1, "Selecciona un estado").positive(),
tipoAnimal: z.number().min(1, "Selecciona un tipo de animal").positive(),
raza: z.number().min(1, "Selecciona una raza").positive(),
titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
vacunado: z.boolean(),
esterilizado: z.boolean(),
genero: z.enum(["MALE", "FEMALE"]),
edad: z.number().min(1, "La edad debe ser mayor a 0").positive(),
peso: z.number().min(1, "El peso debe ser mayor a 0").positive(),
nacimiento: z.string().optional(),
});

export type PetFormValues = z.infer<typeof petSchema>;