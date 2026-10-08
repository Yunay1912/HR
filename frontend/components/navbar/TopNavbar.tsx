import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TopNavbar() {
  return (
    <header className="h-20 border-b border-gray-200 bg-white flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={22} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}