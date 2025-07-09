"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiLogOut,
  FiUser,
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiDatabase,
  FiMenu,
  FiX,
} from "react-icons/fi";

// Types
type MenuItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  iconColor: string;
  subItems?: SubMenuItem[];
};

type SubMenuItem = {
  name: string;
  path: string;
};

type UserMenuItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
  iconColor: string;
};

// Données utilisateur
const USER = {
  name: "Sarah Johnson",
  email: "sarah@groupegate.com",
  role: "Administrateur",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

// Configuration des menus
const MENU_ITEMS: MenuItem[] = [
  {
    name: "Dashboard",
    icon: FiHome,
    path: "/dashboard",
    iconColor: "text-blue-400",
  },
  {
    name: "Équipe",
    icon: FiUsers,
    path: "/team",
    iconColor: "text-green-400",
  },
  {
    name: "Projets",
    icon: FiFolder,
    iconColor: "text-purple-400",
    subItems: [
      { name: "Tous les projets", path: "/projects" },
      { name: "En cours", path: "/projects/current" },
      { name: "Terminés", path: "/projects/completed" },
    ],
  },
  {
    name: "Documents",
    icon: FiFileText,
    iconColor: "text-red-400",
    subItems: [
      { name: "Contrats", path: "/documents/contracts" },
      { name: "Factures", path: "/documents/invoices" },
    ],
  },
  {
    name: "Base de données",
    icon: FiDatabase,
    iconColor: "text-cyan-400",
    subItems: [
      { name: "Clients", path: "/database/clients" },
      { name: "Fournisseurs", path: "/database/suppliers" },
    ],
  },
  {
    name: "Paramètres",
    icon: FiSettings,
    path: "/settings",
    iconColor: "text-gray-400",
  },
];

const USER_MENU_ITEMS: UserMenuItem[] = [
  { name: "Mon profil", icon: FiUser, iconColor: "text-blue-400" },
  { name: "Aide", icon: FiHelpCircle, iconColor: "text-green-400" },
  {
    name: "Déconnexion",
    icon: FiLogOut,
    iconColor: "text-red-400",
    action: () => console.log("Déconnexion"),
  },
];

// Composant Icone colorée
const ColoredIcon = ({
  icon: Icon,
  color,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  className?: string;
}) => <Icon className={`w-5 h-5 flex-shrink-0 ${color} ${className}`} />;

// Composant Sous-menu
const MenuItemWithSubmenu = ({
  item,
  collapsed,
  currentPath,
}: {
  item: MenuItem;
  collapsed: boolean;
  currentPath: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveChild = item.subItems?.some(
    (subItem) => subItem.path === currentPath
  );

  useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild]);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
          hasActiveChild
            ? "bg-indigo-700 text-white"
            : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
        }`}
      >
        <div className="flex items-center min-w-0">
          <ColoredIcon
            icon={item.icon}
            color={hasActiveChild ? "text-white" : item.iconColor}
          />
          {!collapsed && (
            <span className="ml-3 truncate text-left">{item.name}</span>
          )}
        </div>
        {!collapsed &&
          item.subItems &&
          (isOpen ? (
            <FiChevronUp className="w-4 h-4 flex-shrink-0" />
          ) : (
            <FiChevronDown className="w-4 h-4 flex-shrink-0" />
          ))}
      </button>

      {!collapsed && isOpen && item.subItems && (
        <div className="ml-8 mt-1 space-y-1">
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.path}
              href={subItem.path}
              className={`block py-2 px-3 rounded-md text-sm transition-colors truncate ${
                currentPath === subItem.path
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Item de menu
const MenuItem = ({
  item,
  collapsed,
  isActive,
}: {
  item: MenuItem;
  collapsed: boolean;
  isActive: boolean;
}) => {
  if (item.subItems) {
    return (
      <MenuItemWithSubmenu
        item={item}
        collapsed={collapsed}
        currentPath={usePathname()}
      />
    );
  }

  return (
    <Link
      href={item.path || "#"}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-700 text-white"
          : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
      }`}
    >
      <ColoredIcon
        icon={item.icon}
        color={isActive ? "text-white" : item.iconColor}
      />
      {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
    </Link>
  );
};

// Composant Menu utilisateur
const UserMenuDropdown = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-opacity-5 focus:outline-none z-50"
    >
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900 truncate">
            {USER.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{USER.email}</p>
        </div>
        {USER_MENU_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ColoredIcon
              icon={item.icon}
              color={item.iconColor}
              className="mr-3"
            />
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant Profil utilisateur
const UserProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative mx-4">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center max-w-xs rounded-full focus:outline-none"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Ouvrir le menu utilisateur</span>
        {isMenuOpen ? (
          <FiChevronDown className="w-5 h-5 mr-2" />
        ) : (
          <FiChevronUp className="w-5 h-5 mr-2" />
        )}
        <Image
          src={USER.avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
      </button>

      <UserMenuDropdown
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

// Composant principal Sidebar
const ProfessionalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const currentPath = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fermer la sidebar mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        mobileSidebarOpen
      ) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay pour mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-20 md:hidden" />
      )}

      {/* Sidebar - Version mobile */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 bg-indigo-800 text-white flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } overflow-y-auto overflow-x-hidden`}
      >
        {/* Header avec logo et bouton fermer (mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700 sticky top-0 bg-indigo-800 z-10">
          {!collapsed && (
            <div className="flex items-center min-w-0">
              <Image
                src="https://res.cloudinary.com/dbpoyo4gw/image/upload/v1749549435/logo_gate_group_pktaw2.jpg"
                alt="Gate Africa Group"
                width={160}
                height={40}
                className="h-10 w-auto max-w-full rounded-2xl"
                priority
              />
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-indigo-700 transition-colors hidden md:block"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FiChevronsRight className="w-5 h-5" />
              ) : (
                <FiChevronsLeft className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-indigo-700 transition-colors md:hidden"
              aria-label="Fermer le menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="space-y-1 w-full">
            {MENU_ITEMS.map((item) => (
              <li key={item.name} className="w-full">
                <MenuItem
                  item={item}
                  collapsed={collapsed}
                  isActive={currentPath === item.path}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="mr-2 text-gray-500 hover:text-gray-700 md:hidden"
                aria-label="Ouvrir le menu"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                Tableau de bord
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md hidden md:block">
                <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 relative"
                aria-label="Notifications"
              >
                <FiBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <UserProfile />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Bienvenue sur votre tableau de bord
            </h3>
            <p className="mt-2 text-gray-600">
              Vous pouvez maintenant accéder à toutes les fonctionnalités depuis
              la sidebar.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalSidebar;
