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
  Menu as MenuIcon,
  X as CloseIcon,
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
      { name: "Colectas", path: "/administration/crowfunding" },
    ],
  },
  {
    name: "Usuarios",
    isDropdown: true,
    icon: <Users className="w-5 h-5 mr-2" />,
    items: [
      { name: "Regulares", path: "/administration/users/regular" },
      { name: "Organizadores", path: "/administration/users/organizations" },
      { name: "Administradores", path: "/administration/users/admins" },
    ],
  },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIndex]);

  useEffect(() => {
    setOpenIndex(null);
  }, [pathname]);

  return (
    <nav className="w-full bg-white shadow px-2 py-2 relative z-20 flex flex-col">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:hidden mt-2">
        {navbarAdminItems.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              className={`w-full flex items-center justify-between px-4 py-2 text-base font-medium bg-white hover:bg-purple-50 transition-colors ${openAccordion === index ? 'text-purple-600' : 'text-gray-700'}`}
            >
              <span className="flex items-center">{item.icon}{item.name}</span>
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${openAccordion === index ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === index && (
              <div className="flex flex-col bg-white border-t">
                {item.items.map((subItem: any) => (
                  <button
                    key={subItem.path}
                    onClick={() => {
                      handleClick(subItem.path);
                      setOpenAccordion(null);
                    }}
                    className={`w-full text-left px-6 py-2 text-sm hover:bg-gray-50 ${isActiveMenuItem(subItem.path)
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700'
                    }`}
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="hidden sm:flex sm:flex-row sm:gap-4 sm:justify-center sm:w-full mt-2"
      >
        {navbarAdminItems.map((item, index) => (
          <div key={index} className="relative">
            <button
              ref={el => { buttonRefs.current[index] = el; }}
              onClick={() => toggleDropdown(index)}
              className={`flex items-center text-base font-medium px-3 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors w-full sm:w-auto ${isActiveRoute(item)
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
                className={`ml-1 h-4 w-4 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === index && (
              <div
                className={`z-50 w-60 bg-white rounded-md shadow-lg border border-gray-200 mt-1 absolute left-0 top-full`}
                role="menu"
              >
                {item.items.map((subItem: any) => (
                  <button
                    key={subItem.path}
                    onClick={() => {
                      handleClick(subItem.path);
                      setOpenIndex(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${isActiveMenuItem(subItem.path)
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
        ))}
      </div>
    </nav>
  );
}
