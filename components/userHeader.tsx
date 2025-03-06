"use client";
import { Bell, LogOut, User } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@contexts/authContext" // Adjust path as needed

interface UserHeaderProps {
  currentUser: {
    fullName: string;
    email: string;
  };
}

const UserHeader = ({ currentUser }: UserHeaderProps) => {
  const { logout } = useAuth();

  return (
    <div className="flex items-center px-4 py-2 bg-white gap-x-4">
      <Bell className="h-5 w-5 text-amber-500" />


      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="outline-none">
            <Avatar.Root className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 cursor-pointer">
              <Avatar.Fallback className="text-amber-50 font-medium">
                {currentUser.fullName[0]}
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
              <a href="/profile" className="flex items-center gap-2 mb-1">
                <User size={16} className="text-gray-500" />
                <span className="font-medium text-sm text-gray-800">{currentUser.fullName}</span>
              </a>
              <div className="text-xs text-gray-500 pl-6">{currentUser.email}</div>
            </div>

            {/* Logout option */}
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 outline-none cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={logout}
            >
              <LogOut size={16} />
              Cerrar sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default UserHeader;