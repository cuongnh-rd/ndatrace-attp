import { Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ModuleTabs from "@/components/health/ModuleTabs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar />
      <Header />
      <main className="ml-[252px] pt-16 min-h-screen">
        <div className="p-6">
          <Suspense fallback={null}>
            <ModuleTabs>{children}</ModuleTabs>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
