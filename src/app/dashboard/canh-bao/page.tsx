import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertOverview from "@/components/health/pages/AlertOverview";

export default function CanhBaoPage() {
  return (
    <DashboardLayout>
      <AlertOverview />
    </DashboardLayout>
  );
}
