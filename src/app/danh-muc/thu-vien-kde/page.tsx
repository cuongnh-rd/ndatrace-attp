"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import SectionPage from "@/components/ui/SectionPage";
import KdeListTable from "./components/KdeListTable";
import { kdeLibrary } from "./lib/mock-data";

const publishedCount = kdeLibrary.filter((k) => k.status === "published").length;
const deprecatedCount = kdeLibrary.filter((k) => k.status === "deprecated").length;
const latestImport = kdeLibrary
    .flatMap((k) => k.versions)
    .filter((v) => v.is_current)
    .map((v) => v.nghi_dinh)
    .find((n) => n.includes("37/2025")) ?? "—";

export default function Page() {
    return (
        <SectionPage
            title="Thư viện KDE"
            subtitle="Danh sách trường dữ liệu chuẩn (Key Data Elements) cấu thành mọi sự kiện truy xuất nguồn gốc. Import từ nghị định — không chỉnh sửa trực tiếp."
            // stats={[
            //     { label: "Tổng KDE", value: kdeLibrary.length, variant: "info" },
            //     { label: "Đang áp dụng", value: publishedCount, variant: "success" },
            //     { label: "Deprecated", value: deprecatedCount, variant: "neutral" },
            //     { label: "Nghị định mới nhất", value: latestImport, variant: "info" },
            // ]}
            actionButton={
                <Link
                    href="/danh-muc/thu-vien-kde/nhap"
                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-4 py-2 transition-colors"
                >
                    <Upload size={14} /> Nhập KDE từ nghị định
                </Link>
            }
        >
            <KdeListTable />
        </SectionPage>
    );
}
