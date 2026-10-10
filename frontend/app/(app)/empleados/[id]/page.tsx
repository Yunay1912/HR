import PageHeader from "@/components/shared/PageHeader";
import EmpleadoExpediente from "@/components/empleados/EmpleadoExpediente";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8 space-y-8">
      <PageHeader title="Expediente" description="Información del empleado" />
      <EmpleadoExpediente id={id} />
    </div>
  );
}