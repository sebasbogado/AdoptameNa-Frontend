"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Newspaper,
  Trash2,
  Flag,
  Settings,
  Users,
} from "lucide-react";

const navbarAdminItems = [
  {
    name: "Publicaciones",
    isDropdown: true,
    icon: <Newspaper className="w-5 h-5 mr-2" />,
    items: [
      { name: "Administrar Publicaciones", path: "/administration/posts" },
      { name: "Publicaciones Eliminadas", path: "/administration/deleted-posts" },
    ],
  },
  {
    name: "Reportes",
    isDropdown: true,
    icon: <Flag className="w-5 h-5 mr-2" />,
    items: [
      { name: "Reportes de mascotas", path: "/administration/report/pets" },
      { name: "Reportes de publicaciones", path: "/administration/report/posts" },
      { name: "Reportes de productos", path: "/administration/report/products" },
      { name: "Reportes de comentarios", path: "/administration/report/comments" },
    ],
  },
  {
    name: "Configuración",
    isDropdown: true,
    icon: <Settings className="w-5 h-5 mr-2" />,
    items: [
      { name: "Configuraciones", path: "/administration/settings" },
      { name: "Banners", path: "/administration/settings/banner" },
      { name: "Auspiciantes", path: "/administration/sponsors" },
      { name: "Notificaciones", path: "/administration/notifications" },
    ],
  },
  {
    name: "Usuarios",
    path: "/administration/users",
    icon: <Users className="w-5 h-5 mr-2" />,
  },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = (path: string) => {
    router.push(path);
  };

  const toggleDropdown = (index: number) => {
    setOpenIndex((prev) => {
      if (prev === index) {
        return null;
      } else {
        const buttonElement = buttonRefs.current[index];
        if (buttonElement) {
          const rect = buttonElement.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
          });
        }
        return index;
      }
    });
  };
  const isActiveRoute = (item: any) => {
    if (item.isDropdown) {
      return item.items.some((sub: any) => pathname.startsWith(sub.path));
    }
    return pathname.startsWith(item.path);
  };
  
  const isActiveMenuItem = (path: string) => {
    if (path === "/administration/settings" && pathname !== path && pathname.startsWith(path + "/")) {
      return false; 
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openIndex !== null) {
        const targetButton = buttonRefs.current[openIndex];
        const isClickInsideButton = targetButton?.contains(event.target as Node);
        
        if (!isClickInsideButton) {
          const dropdownElements = document.querySelectorAll('[role="menu"]');
          let clickedInsideDropdown = false;
          
          dropdownElements.forEach(elem => {
            if (elem.contains(event.target as Node)) {
              clickedInsideDropdown = true;
            }
          });
          
          if (!clickedInsideDropdown) {
            setOpenIndex(null);
          }
        }
      }
    };    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIndex]);
  
  return (
    <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 w-full md:pb-0 md:justify-center">
      {navbarAdminItems.map((item, index) =>
        item.isDropdown ? (
          <div key={item.path} className="relative">
            <button
              ref={el => { buttonRefs.current[index] = el; }}
              onClick={() => toggleDropdown(index)}
              className={`flex items-center text-base font-medium px-3 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors ${
                isActiveRoute(item)
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-700"
              }`}
              aria-expanded={openIndex === index}
              aria-haspopup="true"
              type="button"
            >
              {item.icon}
              {item.name}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div
                className="fixed z-50 w-60 bg-white rounded-md shadow-lg border border-gray-200"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
                role="menu"
              >
                {item.items.map((subItem: any) => (
                  <button
                    key={subItem.path}
                    onClick={() => {
                      handleClick(subItem.path);
                      setOpenIndex(null);
                    }}                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      isActiveMenuItem(subItem.path)
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-700"
                    }`}
                    role="menuitem"
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            key={item.path}
            onClick={() => handleClick(item.path || "")}
            className={`flex items-center text-base font-medium px-3 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors ${
              isActiveRoute(item)
                ? "bg-purple-100 text-purple-600"
                : "text-gray-700"
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        )
      )}
    </nav>
  );
}
