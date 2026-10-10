import PageHeader from "@/components/shared/PageHeader";
import EmpleadoEditor from "@/components/empleados/EmpleadoEditor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Editar empleado"
        description="Modifica los datos del expediente"
      />
      <EmpleadoEditor id={id} />
    </div>
  );
}