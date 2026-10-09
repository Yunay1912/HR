import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader title="Configuración" description="Personalización de la plataforma" />
      <Card className="rounded-2xl p-6 shadow-sm text-muted-foreground">Próximamente.</Card>
    </div>
  );
}