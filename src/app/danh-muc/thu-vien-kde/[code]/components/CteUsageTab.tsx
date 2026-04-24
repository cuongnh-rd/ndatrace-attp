import { Info } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { CteUsage, Kde } from "../../lib/types";

interface Props {
    kde: Kde;
    usage: CteUsage[];
}

export default function CteUsageTab({ kde, usage }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-xl text-[13px] text-brand-700 dark:text-brand-300">
                <Info size={15} className="flex-shrink-0 mt-0.5" />
                <span>Danh sách CTE đang tham chiếu KDE này. CTE dùng version cũ sẽ hiển thị cảnh báo — Layer 2 có thể chủ động cập nhật.</span>
            </div>

            {usage.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-12 text-center text-[14px] text-gray-400">
                    Chưa có CTE nào sử dụng KDE này
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
                    {usage.map((c) => {
                        const outdated = c.used_version !== kde.current_version;
                        return (
                            <div key={c.cte_id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                <div className="min-w-0">
                                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">{c.cte_name}</p>
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        {c.owner} · <span className="font-mono">{c.used_version}</span> · {c.cte_status === "active" ? "Active" : "Draft"}
                                    </p>
                                </div>
                                {/* {outdated ? (
                                    <Badge variant="warning">Dùng version cũ</Badge>
                                ) : (
                                    <Badge variant="success">Đúng version</Badge>
                                )} */}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
