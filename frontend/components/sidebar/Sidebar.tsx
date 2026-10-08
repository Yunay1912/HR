import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen p-4">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          NexusHR
        </h1>
        <p className="text-sm text-gray-500">
          Human Resources
        </p>
      </div>

      <nav className="space-y-2">
        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition">
          <Users size={20} />
          Employees
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition">
          <CalendarDays size={20} />
          Vacations
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition">
          <FileText size={20} />
          Reports
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition">
          <Settings size={20} />
          Settings
        </button>
      </nav>
    </aside>
  );
}