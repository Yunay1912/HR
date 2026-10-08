import { Card } from "@/components/ui/card";

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back, Yuna
        </h1>

        <p className="text-gray-500 mt-1">
          Here is what is happening today.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">
            Total Employees
          </h3>

          <p className="text-4xl font-semibold mt-4">
            842
          </p>
        </Card>

        <Card className="rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">
            Pending Vacations
          </h3>

          <p className="text-4xl font-semibold mt-4">
            18
          </p>
        </Card>

        <Card className="rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">
            Open Requests
          </h3>

          <p className="text-4xl font-semibold mt-4">
            24
          </p>
        </Card>
      </div>

      <Card className="rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">
          Recent Activity
        </h3>

        <div className="space-y-4 text-gray-600">
          <p>• Vacation request submitted</p>
          <p>• New employee registered</p>
          <p>• Payroll report generated</p>
        </div>
      </Card>
    </div>
  );
}