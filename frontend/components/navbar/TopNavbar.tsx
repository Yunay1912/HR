"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getActiveItem } from "@/lib/navigation";

export default function TopNavbar() {
  const pathname = usePathname();
  const active = getActiveItem(pathname);

  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-between px-8">
      <h2 className="text-2xl font-semibold">{active.title}</h2>

      <div className="flex items-center gap-6">
        <button className="relative" aria-label="Notificaciones">
          <Bell size={22} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}