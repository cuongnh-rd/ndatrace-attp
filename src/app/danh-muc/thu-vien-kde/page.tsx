"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import SectionPage from "@/components/ui/SectionPage";
import KdeListTable from "./components/KdeListTable";

export default function Page() {
    return (
        <SectionPage
            title="Trường dữ liệu"
            subtitle="Danh sách trường dữ liệu chuẩn (Key Data Elements) cấu thành mọi sự kiện truy xuất nguồn gốc."
            actionButton={
                <Link
                    href="/danh-muc/thu-vien-kde/tao-moi"
                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-4 py-2 transition-colors"
                >
                    <Plus size={14} /> Thêm mới
                </Link>
            }
        >
            <KdeListTable />
        </SectionPage>
    );
}
