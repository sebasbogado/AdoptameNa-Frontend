import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
