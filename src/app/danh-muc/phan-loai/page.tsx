"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Layers, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

const phanLoaiData: Record<string, unknown>[] = [
    { maPL: "PL-001", tenPhanLoai: "Nhà hàng, quán ăn", moTa: "Cơ sở kinh doanh dịch vụ ăn uống tại chỗ", soCoSo: 3420, mucRuiRo: "Trung bình", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "6 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-002", tenPhanLoai: "Bếp ăn tập thể", moTa: "Bếp ăn phục vụ từ 30 suất/ngày trở lên tại trường học, khu công nghiệp", soCoSo: 892, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-003", tenPhanLoai: "Cơ sở sản xuất thực phẩm", moTa: "Cơ sở chế biến, sản xuất thực phẩm đóng gói, đóng hộp", soCoSo: 645, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-004", tenPhanLoai: "Thức ăn đường phố", moTa: "Cơ sở kinh doanh thức ăn lưu động, xe đẩy, quầy vỉa hè", soCoSo: 7841, mucRuiRo: "Cao", yeuCauGCN: "Khuyến khích", chuKyKiemTra: "6 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-005", tenPhanLoai: "Siêu thị, cửa hàng tiện lợi", moTa: "Cơ sở bán lẻ thực phẩm đóng gói và thực phẩm tươi sống", soCoSo: 1203, mucRuiRo: "Thấp", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-006", tenPhanLoai: "Chợ truyền thống", moTa: "Cơ sở kinh doanh thực phẩm tươi sống tại chợ đầu mối, chợ dân sinh", soCoSo: 2156, mucRuiRo: "Trung bình", yeuCauGCN: "Không bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-007", tenPhanLoai: "Cơ sở sản xuất nước uống", moTa: "Sản xuất nước đóng chai, nước tinh khiết, nước khoáng thiên nhiên", soCoSo: 178, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-008", tenPhanLoai: "Cơ sở chế biến hải sản", moTa: "Cơ sở sơ chế, chế biến, bảo quản hải sản tươi sống và đông lạnh", soCoSo: 312, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-009", tenPhanLoai: "Cơ sở giết mổ gia súc, gia cầm", moTa: "Lò giết mổ gia súc, gia cầm theo quy mô công nghiệp và thủ công", soCoSo: 45, mucRuiRo: "Rất cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "Hàng tháng", trangThai: "Đang áp dụng" },
    { maPL: "PL-010", tenPhanLoai: "Cơ sở kinh doanh phụ gia thực phẩm", moTa: "Kinh doanh, phân phối phụ gia và hóa chất dùng trong thực phẩm", soCoSo: 234, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "6 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-011", tenPhanLoai: "Căng tin trường học", moTa: "Cơ sở phục vụ ăn uống trong khuôn viên trường mầm non, tiểu học, THCS, THPT", soCoSo: 567, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Đang áp dụng" },
    { maPL: "PL-012", tenPhanLoai: "Cơ sở nhập khẩu thực phẩm", moTa: "Doanh nghiệp nhập khẩu, phân phối thực phẩm có nguồn gốc nước ngoài", soCoSo: 89, mucRuiRo: "Trung bình", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Đang áp dụng" },
];

const stats = [
    { label: "Loại hình", value: "12", icon: Layers, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Rủi ro cao", value: "7", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Bắt buộc GCN", value: "10", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Tổng cơ sở", value: "17.382", icon: XCircle, color: "text-amber-600", bg: "bg-amber-50" },
];

const columns = [
    { key: "maPL", label: "Mã PL", sortable: true },
    { key: "tenPhanLoai", label: "Tên phân loại", sortable: true },
    { key: "moTa", label: "Mô tả" },
    { key: "soCoSo", label: "Số cơ sở", sortable: true },
    {
        key: "mucRuiRo", label: "Mức rủi ro",
        render: (row: Record<string, unknown>) => {
            const val = String(row.mucRuiRo);
            const variant = val === "Rất cao" ? "danger" : val === "Cao" ? "warning" : val === "Trung bình" ? "info" : "neutral";
            return <Badge variant={variant as "danger" | "warning" | "info" | "neutral"}>{val}</Badge>;
        },
    },
    {
        key: "yeuCauGCN", label: "Yêu cầu GCN",
        render: (row: Record<string, unknown>) => {
            const val = String(row.yeuCauGCN);
            const variant = val === "Bắt buộc" ? "success" : val === "Khuyến khích" ? "warning" : "neutral";
            return <Badge variant={variant as "success" | "warning" | "neutral"}>{val}</Badge>;
        },
    },
    { key: "chuKyKiemTra", label: "Chu kỳ kiểm tra" },
    {
        key: "trangThai", label: "Trạng thái",
        render: (row: Record<string, unknown>) => (
            <Badge variant="success">{String(row.trangThai)}</Badge>
        ),
    },
];

export default function PhanLoaiCoSoPage() {
    return (
        <DashboardLayout>
            <PageHeader
                title="Phân loại cơ sở"
                subtitle="Quản lý danh mục phân loại các cơ sở kinh doanh thực phẩm trên địa bàn"
                action={
                    <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        <Plus size={16} />
                        Thêm phân loại
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <Icon size={18} className={s.color} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <DataTable
                    columns={columns}
                    data={phanLoaiData}
                    searchable
                    searchKeys={["maPL", "tenPhanLoai", "mucRuiRo"]}
                />
            </div>
        </DashboardLayout>
    );
}
