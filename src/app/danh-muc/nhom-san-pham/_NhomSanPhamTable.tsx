import Badge from "@/components/ui/Badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { NhomSanPham } from "./_data";

interface NhomSanPhamTableProps {
  data: NhomSanPham[];
  onView: (item: NhomSanPham) => void;
  onEdit: (item: NhomSanPham) => void;
  onDelete: (item: NhomSanPham) => void;
}

export default function NhomSanPhamTable({ data, onView, onEdit, onDelete }: NhomSanPhamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
            {["MÃ NHÓM", "TÊN NHÓM SẢN PHẨM", "ĐƠN VỊ QUẢN LÝ", "SỐ LOẠI HÌNH", "TRẠNG THÁI", "THAO TÁC"].map((h) => (
              <th key={h} className="text-left px-5 py-3">
                <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
              <td className="px-5 py-3.5">
                <span className="font-mono text-[13px] text-gray-700 dark:text-gray-300">{row.code}</span>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium">{row.name}</td>
              <td className="px-5 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">{row.administrative_unit}</td>
              <td className="px-5 py-3.5">
                <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{row.so_loai_hinh}</span>
              </td>
              <td className="px-5 py-3.5">
                <Badge variant={row.status === "ACTIVE" ? "success" : "neutral"}>
                  {row.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(row)}
                    title="Xem chi tiết"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEdit(row)}
                    title="Chỉnh sửa"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    title="Xóa"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-400 text-[14px]">
                Không có dữ liệu phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
