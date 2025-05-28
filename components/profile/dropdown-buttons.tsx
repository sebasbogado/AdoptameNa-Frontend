import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "../buttons/button";
import { UserProfile } from "@/types/user-profile";
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import DirectMessageButton from "../chat/direct-message-button";



interface Props {
  variant?: "primary" | "secondary" | "danger" | "tertiary" | "action" | "cta";
  size?: "sm" | "md" | "lg";
  className?: string;
  handleContactClick: () => void;
  handleWhatsAppClick: () => void;
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
}

export const DropdownMenuButtons: React.FC<Props> = ({
  variant = "cta",
  size = "md",
  className,
  handleContactClick,
  handleWhatsAppClick,
  userProfile,
  isLoggedIn,
}: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant={variant} size={size} className={className}>
          Contactar
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className='min-w-[125px] bg-white rounded-md p-2 shadow-md space-y-2'
        side='bottom'
        align='center'
        sideOffset={5}>

        <DropdownMenu.Item>
          <button
            onClick={handleContactClick}
            className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                ${!userProfile?.email || userProfile?.email === "No Disponible"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200 hover:text-gray-800"
              }`}
            disabled={
              !userProfile?.email || userProfile?.email === "No Disponible"
            }>
            <MailIcon />
            <span className='font-medium text-sm text-gray-800'>
              Correo:{" "}
            </span>
            <span className='font-medium text-sm text-gray-500'>
              {userProfile?.email || "No Disponible"}
            </span>
          </button>
        </DropdownMenu.Item>

        <DropdownMenu.Item>
          <button
            onClick={handleWhatsAppClick}
            className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                ${!userProfile?.phoneNumber ||
                userProfile?.phoneNumber === "No Disponible"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200 hover:text-gray-800"
              }`}
            disabled={
              !userProfile?.phoneNumber ||
              userProfile?.phoneNumber === "No Disponible"
            }>
            <PhoneIcon />

            <span className='font-medium text-sm text-gray-800'>
              WhatsApp:{" "}
            </span>
            <span className='font-medium text-sm text-gray-500'>
              {userProfile?.phoneNumber || "No Disponible"}
            </span>
          </button>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          {userProfile ? (
            isLoggedIn ? (
              <DirectMessageButton
                userId={userProfile.id}
                userName={userProfile.fullName}
                userEmail={userProfile.email}
              />
            ) : (
              <button
                disabled
                className="flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
          opacity-50 cursor-not-allowed text-gray-500 bg-gray-100 w-full text-left"
              >
                <MessageCircleIcon />
                <span className="text-sm font-medium">
                  Debe estar logueado para enviar mensaje
                </span>
              </button>
            )
          ) : (
            <div className="text-sm text-gray-400 px-3 py-2">Cargando perfil...</div>
          )}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
