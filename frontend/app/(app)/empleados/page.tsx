import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmpleadosManager from "@/components/empleados/EmpleadosManager";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Empleados"
        description="Expedientes digitales del personal"
      >
        <Link href="/empleados/nuevo" className={buttonVariants()}>
          <Plus /> Nuevo empleado
        </Link>
      </PageHeader>
      <EmpleadosManager />
    </div>
  );
}