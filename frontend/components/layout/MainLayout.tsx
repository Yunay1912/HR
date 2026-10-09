import type { CSSProperties } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopNavbar from "@/components/navbar/TopNavbar";
import { companyConfig } from "@/lib/company";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // El color de la empresa reemplaza los colores "primary" del tema.
  const brandStyle = {
    "--primary": companyConfig.primaryColor,
    "--sidebar-primary": companyConfig.primaryColor,
    "--primary-foreground": "#ffffff",
    "--sidebar-primary-foreground": "#ffffff",
  } as CSSProperties;

  return (
    <div className="flex bg-muted/40 min-h-screen" style={brandStyle}>
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopNavbar />
        <main>{children}</main>
      </div>
    </div>
  );
}