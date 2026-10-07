import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardOverview from "@/components/health/DashboardOverview";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
