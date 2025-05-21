import { z } from "zod";
import { NotificationType } from "@/types/notification";

export const notificationSchema = z
  .object({
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(100, "El título no puede exceder 100 caracteres"),
    message: z
      .string()
      .min(10, "El mensaje debe tener al menos 10 caracteres")
      .max(500, "El mensaje no puede exceder 500 caracteres"),
    type: z.nativeEnum(NotificationType),
    targetRoleIds: z.array(z.number()).optional(),
    targetUserIds: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === NotificationType.ROLE_BASED) {
        return data.targetRoleIds && data.targetRoleIds.length > 0;
      }
      return true;
    },
    {
      message: "Debe seleccionar al menos un rol si el tipo de notificación es por rol",
      path: ["targetRoleIds"],
    }
  );

export type NotificationFormData = z.infer<typeof notificationSchema>;