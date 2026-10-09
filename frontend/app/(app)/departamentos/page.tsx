import PageHeader from "@/components/shared/PageHeader";
import DepartamentosManager from "@/components/departamentos/DepartamentosManager";

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Departamentos"
        description="Estructura y áreas de la empresa"
      />
      <DepartamentosManager />
    </div>
  );
}