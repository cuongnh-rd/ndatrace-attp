"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TableToolbar from "@/components/ui/TableToolbar";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/ui/MultiSelect";
import { Plus } from "lucide-react";

interface PhanLoai {
  maPL: string;
  tenPhanLoai: string;
  moTa: string;
  soCoSo: number;
  mucRuiRo: string;
  yeuCauGCN: string;
  chuKyKiemTra: string;
  trangThai: string;
  nhomSanPhamIds: string[];
  nhomSanPhamNames: string[];
}

// NSP options (ACTIVE only – synced with nhom-san-pham mock data)
const NSP_OPTIONS = [
  { value: "NSP_YT_001", label: "Nước uống đóng chai" },
  { value: "NSP_YT_002", label: "Thực phẩm chức năng" },
  { value: "NSP_YT_003", label: "Phụ gia thực phẩm" },
  { value: "NSP_NN_001", label: "Ngũ cốc" },
  { value: "NSP_NN_002", label: "Thịt và sản phẩm từ thịt" },
  { value: "NSP_NN_003", label: "Thủy sản" },
  { value: "NSP_CT_001", label: "Bia" },
  { value: "NSP_CT_002", label: "Nước giải khát" },
  { value: "NSP_CT_003", label: "Sữa chế biến" },
];

const initialData: PhanLoai[] = [
  { maPL: "PL-001", tenPhanLoai: "Nhà hàng, quán ăn", moTa: "Cơ sở kinh doanh dịch vụ ăn uống tại chỗ", soCoSo: 3420, mucRuiRo: "Trung bình", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "6 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_001"], nhomSanPhamNames: ["Nước giải khát", "Bia"] },
  { maPL: "PL-002", tenPhanLoai: "Bếp ăn tập thể", moTa: "Bếp ăn phục vụ từ 30 suất/ngày trở lên tại trường học, khu công nghiệp", soCoSo: 892, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], nhomSanPhamNames: ["Ngũ cốc", "Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-003", tenPhanLoai: "Cơ sở sản xuất thực phẩm", moTa: "Cơ sở chế biến, sản xuất thực phẩm đóng gói, đóng hộp", soCoSo: 645, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_003", "NSP_CT_003"], nhomSanPhamNames: ["Phụ gia thực phẩm", "Sữa chế biến"] },
  { maPL: "PL-004", tenPhanLoai: "Thức ăn đường phố", moTa: "Cơ sở kinh doanh thức ăn lưu động, xe đẩy, quầy vỉa hè", soCoSo: 7841, mucRuiRo: "Cao", yeuCauGCN: "Khuyến khích", chuKyKiemTra: "6 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-005", tenPhanLoai: "Siêu thị, cửa hàng tiện lợi", moTa: "Cơ sở bán lẻ thực phẩm đóng gói và thực phẩm tươi sống", soCoSo: 1203, mucRuiRo: "Thấp", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003", "NSP_NN_001"], nhomSanPhamNames: ["Nước giải khát", "Sữa chế biến", "Ngũ cốc"] },
  { maPL: "PL-006", tenPhanLoai: "Chợ truyền thống", moTa: "Cơ sở kinh doanh thực phẩm tươi sống tại chợ đầu mối, chợ dân sinh", soCoSo: 2156, mucRuiRo: "Trung bình", yeuCauGCN: "Không bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002", "NSP_NN_003"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt", "Thủy sản"] },
  { maPL: "PL-007", tenPhanLoai: "Cơ sở sản xuất nước uống", moTa: "Sản xuất nước đóng chai, nước tinh khiết, nước khoáng thiên nhiên", soCoSo: 178, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_001"], nhomSanPhamNames: ["Nước uống đóng chai"] },
  { maPL: "PL-008", tenPhanLoai: "Cơ sở chế biến hải sản", moTa: "Cơ sở sơ chế, chế biến, bảo quản hải sản tươi sống và đông lạnh", soCoSo: 312, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_003"], nhomSanPhamNames: ["Thủy sản"] },
  { maPL: "PL-009", tenPhanLoai: "Cơ sở giết mổ gia súc, gia cầm", moTa: "Lò giết mổ gia súc, gia cầm theo quy mô công nghiệp và thủ công", soCoSo: 45, mucRuiRo: "Rất cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "Hàng tháng", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-010", tenPhanLoai: "Cơ sở kinh doanh phụ gia thực phẩm", moTa: "Kinh doanh, phân phối phụ gia và hóa chất dùng trong thực phẩm", soCoSo: 234, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "6 tháng/lần", trangThai: "Không hoạt động", nhomSanPhamIds: ["NSP_YT_003"], nhomSanPhamNames: ["Phụ gia thực phẩm"] },
  { maPL: "PL-011", tenPhanLoai: "Căng tin trường học", moTa: "Cơ sở phục vụ ăn uống trong khuôn viên trường mầm non, tiểu học, THCS, THPT", soCoSo: 567, mucRuiRo: "Cao", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "3 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], nhomSanPhamNames: ["Ngũ cốc", "Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-012", tenPhanLoai: "Cơ sở nhập khẩu thực phẩm", moTa: "Doanh nghiệp nhập khẩu, phân phối thực phẩm có nguồn gốc nước ngoài", soCoSo: 89, mucRuiRo: "Trung bình", yeuCauGCN: "Bắt buộc", chuKyKiemTra: "12 tháng/lần", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003"], nhomSanPhamNames: ["Nước giải khát", "Sữa chế biến"] },
];

const EMPTY_FORM = {
  tenPhanLoai: "",
  moTa: "",
  trangThai: "Hoạt động" as string,
  nhomSanPhamIds: [] as string[],
};

const inputCls = "w-full px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors";
const labelCls = "block text-[13px] font-medium text-gray-700 mb-1";

export default function PhanLoaiCoSoPage() {
  const [data, setData] = useState<PhanLoai[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PhanLoai | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [nspError, setNspError] = useState("");

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((d) => {
      if (q && !(d.maPL.toLowerCase().includes(q) || d.tenPhanLoai.toLowerCase().includes(q))) return false;
      if (filters.trangThai && d.trangThai !== filters.trangThai) return false;
      return true;
    });
  }, [data, searchQuery, filters]);

  function openEdit(item: PhanLoai) {
    setEditTarget(item);
    setFormData({
      tenPhanLoai: item.tenPhanLoai,
      moTa: item.moTa,
      trangThai: item.trangThai,
      nhomSanPhamIds: item.nhomSanPhamIds,
    });
    setNspError("");
    setEditOpen(true);
  }

  function handleSave() {
    if (formData.nhomSanPhamIds.length === 0) {
      setNspError("Phải chọn ít nhất 1 Nhóm sản phẩm");
      return;
    }
    setNspError("");
    if (!editTarget) return;

    const names = NSP_OPTIONS
      .filter((o) => formData.nhomSanPhamIds.includes(o.value))
      .map((o) => o.label);

    setData((prev) =>
      prev.map((d) =>
        d.maPL === editTarget.maPL
          ? {
              ...d,
              tenPhanLoai: formData.tenPhanLoai,
              moTa: formData.moTa,
              trangThai: formData.trangThai,
              nhomSanPhamIds: formData.nhomSanPhamIds,
              nhomSanPhamNames: names,
            }
          : d
      )
    );
    setEditOpen(false);
  }

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

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <TableToolbar
          searchable
          searchQuery={searchQuery}
          onSearchChange={(v: string) => setSearchQuery(v)}
          filterableCols={[
            { key: "trangThai", label: "Trạng thái", options: ["Hoạt động", "Không hoạt động"] },
          ]}
          data={data as unknown as Record<string, unknown>[]}
          filters={filters}
          onFilterChange={(key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onClearFilters={() => setFilters({})}
          total={filteredData.length}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                {["MÃ PL", "TÊN PHÂN LOẠI", "MÔ TẢ", "NHÓM SẢN PHẨM", "TRẠNG THÁI", "THAO TÁC"].map((h) => (
                  <th key={h} className="text-left px-5 py-3">
                    <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.maPL} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[13px] text-gray-700 dark:text-gray-300">{row.maPL}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium">{row.tenPhanLoai}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600 dark:text-gray-400 max-w-xs">{row.moTa}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">
                    {row.nhomSanPhamNames.length > 0 ? row.nhomSanPhamNames.join(", ") : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={row.trangThai === "Hoạt động" ? "success" : "neutral"}>{row.trangThai}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openEdit(row)}
                      className="text-[12px] text-amber-600 hover:underline font-medium"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-[14px]">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh sửa phân loại cơ sở">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Tên phân loại</label>
            <input
              type="text"
              value={formData.tenPhanLoai}
              onChange={(e) => setFormData({ ...formData, tenPhanLoai: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Trạng thái</label>
            <select
              value={formData.trangThai}
              onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
              className={inputCls}
            >
              {["Hoạt động", "Không hoạt động"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>
              Nhóm sản phẩm áp dụng <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              options={NSP_OPTIONS}
              value={formData.nhomSanPhamIds}
              onChange={(v) => {
                setFormData({ ...formData, nhomSanPhamIds: v });
                if (v.length > 0) setNspError("");
              }}
              placeholder="Chọn nhóm sản phẩm..."
            />
            {nspError && <p className="mt-1 text-[12px] text-red-500">{nspError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
