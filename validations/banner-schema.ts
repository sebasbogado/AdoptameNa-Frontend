import { z } from "zod";

export const bannerSchema = z.object({
  startDate: z.date({
    required_error: "La fecha de inicio es obligatoria",
  }),
  endDate: z.date({
    required_error: "La fecha de finalización es obligatoria",
  }),
  imageId: z.number({
    required_error: "La imagen es obligatoria",
  }),
  priority: z.coerce
    .number()
    .int()
    .min(0, "La prioridad mínima es 0")
    .max(100, "La prioridad máxima es 100")
    .default(0),
  isActive: z.boolean().default(true),
});

export type BannerForm = z.infer<typeof bannerSchema>;
