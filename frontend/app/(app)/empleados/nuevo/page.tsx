import PageHeader from "@/components/shared/PageHeader";
import EmpleadoForm from "@/components/empleados/EmpleadoForm";

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Nuevo empleado"
        description="Crea el expediente digital del empleado"
      />
      <EmpleadoForm />
    </div>
  );
}