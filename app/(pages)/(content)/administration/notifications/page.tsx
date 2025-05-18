"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { NotificationType, NotificationDTO } from "@/types/notification";
import { createNotification } from "@/utils/notifications.http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationFormData, notificationSchema } from "@/validations/notification-schema";
import { Bell, UsersRound, Globe } from "lucide-react";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { USER_ROLE } from "@/types/constants";
import { getAllFullUserProfile } from "@/utils/user-profile.http";
import { UserResponse } from "@/types/auth";
import { useDebouncedValue } from "@/hooks/use-debounce";


export default function NotificationsAdminPage() {
  const { authToken, loading, user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocompletado de usuarios
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const debouncedUserSearch = useDebouncedValue(userSearch, 400);

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.GLOBAL,
    }
  });

  const notificationType = watch("type");

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Buscar usuarios para autocompletado
  useEffect(() => {
    const fetchUsers = async () => {
      if (!authToken || !debouncedUserSearch) {
        setUserOptions([]);
        return;
      }
      try {
        const res = await getAllFullUserProfile(authToken, {
          page: 1,
          size: 10,
          name: debouncedUserSearch,
        });
        setUserOptions(
          res.data.map((user: any) => ({
            ...user,
            isVerified: true, // o false, según tu lógica
            role: user.role || "", // o el valor adecuado si existe
          }))
        );
      } catch {
        setUserOptions([]);
      }
    };
    fetchUsers();
  }, [debouncedUserSearch, authToken]);

  // Filtrado adicional en el frontend para autocompletado
  const filteredOptions = userOptions.filter(user =>
    (user.fullName && user.fullName.toLowerCase().includes(userSearch.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const onSubmit = async (data: NotificationFormData) => {
    if (!authToken) return;

    setIsSubmitting(true);
    try {
      const notificationData: NotificationDTO = {
        title: data.title,
        message: data.message,
        type: data.type,
      };

      if (data.type === NotificationType.ROLE_BASED && data.targetRoleIds) {
        notificationData.targetRoleIds = data.targetRoleIds;
      } else if (data.type === NotificationType.USER_BASED && selectedUser) {
        notificationData.type = NotificationType.PERSONAL;
        notificationData.targetUserId = selectedUser.id;
        delete notificationData.targetRoleIds;
      }

      // Limpiar campos no usados
      if (notificationData.type === NotificationType.ROLE_BASED) {
        delete notificationData.targetUserId;
      }
      if (notificationData.type === NotificationType.PERSONAL) {
        delete notificationData.targetRoleIds;
      }

      console.log("Enviando notificación:", notificationData);

      await createNotification(notificationData, authToken);
      setSuccessMessage("Notificación enviada correctamente");
      reset();
      setSelectedUser(null);
      setUserSearch("");
    } catch (error: any) {
      console.error("Error al enviar notificación:", error);
      setErrorMessage(error.message || "Error al enviar notificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!authToken || !user || user.role !== "admin") return <NotFound />;

  return (
    <div className="p-8">
      {successMessage && (
        <Alert
          color="green"
          className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          color="red"
          className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}

      <h1 className="text-3xl font-bold mb-8">Administración de Notificaciones</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2 text-purple-600" />
          Enviar Notificación
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Notificación</label>
            <div className="flex flex-wrap gap-4">
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${notificationType === NotificationType.ROLE_BASED ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  value={NotificationType.ROLE_BASED}
                  {...register("type")}
                  className="sr-only"
                />
                <UsersRound className="h-5 w-5 text-purple-500 mr-2" />
                <div>
                  <div className="font-medium">Por Rol</div>
                  <div className="text-xs text-gray-500">Enviada a usuarios con roles específicos</div>
                </div>
              </label>
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${notificationType === NotificationType.GLOBAL ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  value={NotificationType.GLOBAL}
                  {...register("type")}
                  className="sr-only"
                />
                <Globe className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Global</div>
                  <div className="text-xs text-gray-500">Enviada a todos los usuarios</div>
                </div>
              </label>
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${notificationType === NotificationType.USER_BASED ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  value={NotificationType.USER_BASED}
                  {...register("type")}
                  className="sr-only"
                />
                <UsersRound className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <div className="font-medium">Por usuario</div>
                  <div className="text-xs text-gray-500">Enviada a usuarios específicos</div>
                </div>
              </label>
            </div>
          </div>

          {/* Selector de usuarios para USER_BASED */}
          {notificationType === NotificationType.USER_BASED && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Seleccionar usuario</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 mb-2"
                placeholder="Buscar por ID, correo o nombre"
                value={userSearch}
                onChange={e => {
                  setUserSearch(e.target.value);
                  setSelectedUser(null);
                }}
                disabled={!!selectedUser}
              />
              {filteredOptions.length > 0 && !selectedUser && (
                <ul className="border rounded-md bg-white max-h-40 overflow-y-auto mb-2">
                  {filteredOptions.map(user => (
                    <li
                      key={user.id}
                      className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserOptions([]);
                        setUserSearch(user.fullName ? user.fullName : user.email);
                      }}
                    >
                      <span>
                        {user.fullName ? user.fullName : user.email} ({user.email})
                      </span>
                      <span className="text-xs text-gray-400">ID: {user.id}</span>
                    </li>
                  ))}
                </ul>
              )}
              {selectedUser && (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                    {selectedUser.fullName ? selectedUser.fullName : selectedUser.email}
                    <button
                      type="button"
                      className="ml-1 text-blue-500 hover:text-red-500"
                      onClick={() => {
                        setSelectedUser(null);
                        setUserSearch("");
                      }}
                    >✕</button>
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={`w-full border rounded-md p-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Título de la notificación"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Mensaje</label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              className={`w-full border rounded-md p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Contenido del mensaje..."
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {notificationType === NotificationType.ROLE_BASED && (
            <div>
              <label className="block text-sm font-medium mb-1">Roles de destinatarios</label>
              <div className="space-y-2">
                {Object.entries(USER_ROLE).map(([roleName, roleId]) => (
                  <div
                    className="flex items-center p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-gray-50"
                    key={roleId}
                  >
                    <input
                      type="checkbox"
                      id={`role-${roleName.toLowerCase()}`}
                      className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      onChange={(e) => {
                        const currentRoles = watch("targetRoleIds") || [];
                        if (e.target.checked) {
                          setValue("targetRoleIds", [...currentRoles, roleId]);
                        } else {
                          setValue("targetRoleIds", currentRoles.filter((id: number) => id !== roleId));
                        }
                      }}
                      defaultChecked={roleId === USER_ROLE.ADMIN} // Default check for admin
                    />
                    <label
                      htmlFor={`role-${roleName.toLowerCase()}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
              {errors.targetRoleIds && (
                <p className="text-red-500 text-xs mt-1">{errors.targetRoleIds.message as string}</p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Notificación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}