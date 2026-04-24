import type { Kde, KdeField } from "../../lib/types";

interface Props {
    kde: Kde;
    version: KdeField;
}

function Mono({ children }: { children: React.ReactNode }) {
    return (
        <span className="font-mono text-[13px] bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">
            {children}
        </span>
    );
}

export default function KdeInfoTab({ kde, version }: Props) {
    const rows: [string, React.ReactNode][] = [
        ["Mã dữ liệu", <Mono key="c">{kde.code}</Mono>],
        ["Tên dữ liệu", kde.name],
        ["Mô tả", version.description],
        ["Kiểu dữ liệu", <Mono key="t">{version.data_type}</Mono>],
        ["Đơn vị", version.unit],
        ["Quy tắc validate", version.validation_rule],
        ["Nhóm thông tin", kde.nhom_thong_tin],
        ["Phiên bản hiện tại", <Mono key="v">{kde.current_version}</Mono>],
        // ["Nghị định", version.nghi_dinh_full],
        // ["Cơ quan ban hành", version.co_quan],
        ["Ngày tạo", version.import_date],
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
            {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
                    <div className="text-[14px] text-gray-500 dark:text-gray-400">{label}</div>
                    <div className="text-[14px] text-gray-800 dark:text-gray-200">{value}</div>
                </div>
            ))}
        </div>
    );
}
