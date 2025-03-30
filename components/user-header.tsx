"use client";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { User as UserType } from "@/types/auth";
import { useAuth } from "@/contexts/auth-context";
import { Bell, FileCheck2, Heart, LogOutIcon, ShieldUser, User, User2, UserCircleIcon, UserIcon } from "lucide-react";

const UserHeader = ({ currentUser }: { currentUser: UserType }) => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center px-4 py-2 bg-white gap-x-4">
     <Bell className=" text-amber-500"/>
      

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="outline-none">
            <Avatar.Root className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 cursor-pointer" id="avatar">
              <Avatar.Fallback className="text-amber-50 font-medium">
                {currentUser.fullName?.[0]}
              </Avatar.Fallback>
            </Avatar.Root>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-white rounded-md p-2 shadow-md"
            sideOffset={5}
          >
            {/* User info section */}
            <div className="px-3 py-2 border-b border-gray-200 mb-1">
              <Link href="/profile" className="flex items-center gap-2 mb-1">
                <UserIcon className="w-5 h-5" strokeWidth={2}/>
                <span className="font-medium text-sm text-gray-800">{currentUser.fullName}</span>
              </Link>
              <div className="text-xs text-gray-500 pl-6">{currentUser.email}</div>
            </div>

            {/* Administration menu */}
            {currentUser.role === "admin" && (
              <div className="py-2 border-b border-gray-200 mb-1">
                <Link href="/administration" className="flex items-center gap-2 mb-1 ">
                <DropdownMenu.Item className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#3E3E3E] hover:bg-gray-100 rounded-md outline-none cursor-pointer">
                <ShieldUser className="w-6 h-6" strokeWidth={2}/>
                  <span className="font-medium text-sm text-gray-800">Administración</span>
                </DropdownMenu.Item>
                </Link>
              </div>
            )}

            {/* Mis favoritos */}
            <div>
              <Link href="/profile/favorites" className="flex items-center gap-2">
                <DropdownMenu.Item className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#3E3E3E] hover:bg-gray-100 rounded-md outline-none cursor-pointer">
                <Heart className="w-5 h-5" strokeWidth={2}/>
                Mis favoritos
                </DropdownMenu.Item>
              </Link>
            </div>

            {/* Mis solicitudes */}
            <div>
              <Link href="/profile/received-request" className="flex items-center gap-2">
                <DropdownMenu.Item className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#3E3E3E] hover:bg-gray-100 rounded-md outline-none cursor-pointer">
                <FileCheck2 className="w-5 h-5" strokeWidth={2}/>
                 Mis solicitudes
                </DropdownMenu.Item>
              </Link>
            </div>

            {/* Mi Perfil */}
            <div>
              <Link href="/profile" className="flex items-center gap-2">
                <DropdownMenu.Item className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#3E3E3E] hover:bg-gray-100 rounded-md outline-none cursor-pointer">
                <UserCircleIcon className="w-5 h-5" strokeWidth={2}/>
                Mi perfil
                </DropdownMenu.Item>
              </Link>
            </div>

            {/* Logout option */}
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 outline-none cursor-pointer hover:bg-red-100 rounded-md"
              onClick={logout}
            >
              <LogOutIcon className="w-5 h-5" strokeWidth={2}/>
               Cerrar sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default UserHeader;