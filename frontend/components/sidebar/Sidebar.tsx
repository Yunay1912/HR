"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, getActiveItem } from "@/lib/navigation";
import { companyConfig } from "@/lib/company";

export default function Sidebar() {
  const pathname = usePathname();
  const active = getActiveItem(pathname);

  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0 p-4">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">{companyConfig.name}</h1>
        <p className="text-sm text-muted-foreground">{companyConfig.tagline}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === active.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent"
              )}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}