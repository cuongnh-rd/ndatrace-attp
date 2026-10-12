"use client";

import { use } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Banner } from "@/components/txng/ui";
import { canEdit, cteById, vDraft } from "@/lib/txng/cte";
import CteWizard from "../../components/CteWizard";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const cte = cteById(id);
    if (!cte || !vDraft(cte) || !canEdit(cte)) {
        return (
            <DashboardLayout>
                <Banner kind="warn">
                    {!cte ? "Không tìm thấy sự kiện trọng yếu." : !canEdit(cte) ? "Bạn không có quyền sửa CTE này. Chỉ có thể Clone (F-M5-F5)." : "CTE đã công bố không sửa trực tiếp. Sử dụng 'Tạo phiên bản mới'."}{" "}
                    <Link className="font-semibold underline" href={cte ? `/danh-muc/su-kien-trong-yeu/${id}` : "/danh-muc/su-kien-trong-yeu"}>Quay lại</Link>
                </Banner>
            </DashboardLayout>
        );
    }
    return <CteWizard key={id} cte={cte} />;
}
