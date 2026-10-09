import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarClock,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, description: "Resumen general de la empresa" },
  { title: "Empleados", href: "/empleados", icon: Users, description: "Expedientes digitales del personal" },
  { title: "Departamentos", href: "/departamentos", icon: Building2, description: "Estructura y áreas de la empresa" },
  { title: "Horarios", href: "/horarios", icon: CalendarClock, description: "Jornadas, turnos y asistencia" },
  { title: "Constancias", href: "/constancias", icon: FileText, description: "Constancias laborales automáticas" },
  { title: "Configuración", href: "/configuracion", icon: Settings, description: "Personalización de la plataforma" },
];

// Devuelve la sección activa según la URL actual.
export function getActiveItem(pathname: string): NavItem {
  const match = navItems
    .filter((item) => item.href !== "/")
    .find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  return match ?? navItems[0];
}