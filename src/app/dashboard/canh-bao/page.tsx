import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertOverview from "@/components/health/AlertOverview";

export default function CanhBaoPage() {
  return (
    <DashboardLayout>
      <AlertOverview />
    </DashboardLayout>
  );
}
