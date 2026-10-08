import Sidebar from "@/components/sidebar/Sidebar";
import TopNavbar from "@/components/navbar/TopNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}