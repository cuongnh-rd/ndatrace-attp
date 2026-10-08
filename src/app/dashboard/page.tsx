import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardOverview from "@/components/health/pages/DashboardOverview";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
