"use client";

import SectionPage from "@/components/ui/SectionPage";
import KdeListTable from "./components/KdeListTable";
import { kdeLibrary } from "./lib/mock-data";

const publishedCount = kdeLibrary.filter((k) => k.status === "Hoạt động").length;
const deprecatedCount = kdeLibrary.filter((k) => k.status === "Ngừng hoạt động").length;
const latestImport = kdeLibrary
    .flatMap((k) => k.versions)
    .filter((v) => v.is_current)
    .map((v) => v.nghi_dinh)
    .find((n) => n.includes("37/2025")) ?? "—";

export default function Page() {
    return (
        <SectionPage
            title="Trường dữ liệu"
            subtitle="Danh sách trường dữ liệu chuẩn (Key Data Elements) cấu thành mọi sự kiện truy xuất nguồn gốc."
            addLabel="Thêm mới"
        // stats={[
        //     { label: "Tổng KDE", value: kdeLibrary.length, variant: "info" },
        //     { label: "Đang áp dụng", value: publishedCount, variant: "success" },
        //     { label: "Deprecated", value: deprecatedCount, variant: "neutral" },
        //     { label: "Nghị định mới nhất", value: latestImport, variant: "info" },
        // ]}
        // Primary action is Thêm mới; import action is secondary and currently hidden.
        >
            <KdeListTable />
        </SectionPage>
    );
}
