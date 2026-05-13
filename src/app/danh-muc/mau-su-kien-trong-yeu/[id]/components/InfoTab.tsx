import type { CteTemplate } from "../../lib/types";

interface Props {
    template: CteTemplate;
}

export default function InfoTab({ template: t }: Props) {
    const rows: { label: string; value: React.ReactNode }[] = [
        { label: "Mã mẫu", value: <code className="font-mono text-[13px] text-brand-600 dark:text-brand-400">{t.vc_type}</code> },
        { label: "Tên mẫu sự kiện", value: t.vc_type_name },
        { label: "Cấp ban hành", value: t.authority_level === "Provincial" ? "Sở / Tỉnh" : "Bộ / Trung ương" },
        { label: "Nhóm ngành hàng", value: t.family_name || "—" },
        { label: "Phiên bản hiện tại", value: <span className="font-mono font-semibold">v{t.version}</span> },
        { label: "Người tạo", value: t.created_by },
        { label: "Cập nhật lần cuối", value: t.updated_at },
        { label: "Mô tả", value: t.description || "—" },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {rows.map(({ label, value }) => (
                <div key={label} className="flex gap-0 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="w-52 shrink-0 px-5 py-3.5 bg-gray-50/60 dark:bg-gray-800/40">
                        <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{label}</p>
                    </div>
                    <div className="flex-1 px-5 py-3.5">
                        <p className="text-[14px] text-gray-700 dark:text-gray-300">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
