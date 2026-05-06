import Badge from "@/components/ui/Badge";
import { PhanLoai } from "./_data";

interface PhanLoaiTableProps {
  data: PhanLoai[];
  onEdit: (item: PhanLoai) => void;
  onDelete: (item: PhanLoai) => void;
}

export default function PhanLoaiTable({ data, onEdit, onDelete }: PhanLoaiTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
            {["Mã Loại hình", "Tên loại hình", "Mô tả", "Nhóm sản phẩm", "Trạng thái", "Thao tác"].map((h) => (
              <th key={h} className="text-left px-5 py-3">
                <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
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
                <div className="flex items-center gap-3">
                  <button onClick={() => onEdit(row)} className="text-[12px] text-amber-600 hover:underline font-medium">
                    Sửa
                  </button>
                  <button onClick={() => onDelete(row)} className="text-[12px] text-red-500 hover:underline font-medium">
                    Xoá
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
