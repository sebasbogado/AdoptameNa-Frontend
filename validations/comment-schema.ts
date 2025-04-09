import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "El comentario no puede estar vacío")
    .max(500, "El comentario no puede exceder los 500 caracteres"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
