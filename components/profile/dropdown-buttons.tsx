import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '../buttons/button';
import { UserProfile } from '@/types/user-profile';
import { Mail } from 'lucide-react';
import MenuButton from '../buttons/menu-button';
interface Props {
    handleContactClick: () => void;
    handleWhatsAppClick: () => void;
    userProfile: UserProfile | null;
}
export const DropdownMenuButtons = ({ handleContactClick, handleWhatsAppClick, userProfile }: Props) => {
    return (
        <>

            <DropdownMenu.Root>
                {/* Botón para desplegar el menú */}
                <DropdownMenu.Trigger asChild>
                    <Button
                        variant="cta"
                        size="lg"
                    >
                        Contactar
                    </Button>
                </DropdownMenu.Trigger>

                {/* Contenido del menú desplegable */}
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[125px] bg-white rounded-md p-2 shadow-md space-y-2"
                        sideOffset={5}
                    >
                        {/* Agrega las opciones del menú aquí */}
                        <DropdownMenu.Item>
                            <button onClick={handleContactClick} className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                ${!userProfile?.email || userProfile?.email === "No Disponible" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-800'}`}
                                disabled={!userProfile?.email || userProfile?.email === "No Disponible"} >
                                <span className="material-symbols-outlined">
                                    mail
                                </span>                    <span className="font-medium text-sm text-gray-800">Correo: </span>
                                <span className="font-medium text-sm text-gray-500">{userProfile?.email || "No Disponible"}</span>
                            </button>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item>
                            <button onClick={handleWhatsAppClick} className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                ${!userProfile?.phoneNumber || userProfile?.phoneNumber === "No Disponible" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-800'}`}
                                disabled={!userProfile?.phoneNumber || userProfile?.phoneNumber === "No Disponible"}>
                                  <span className="material-symbols-outlined">
                        call
                        </span>

                                    <span className="font-medium text-sm text-gray-800">WhatsApp: </span>
                                    <span className="font-medium text-sm text-gray-500">{userProfile?.phoneNumber || "No Disponible"}</span>
                            </button>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <MenuButton size="lg" />
        </>
    )
}
