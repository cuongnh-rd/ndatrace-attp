import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { PhanLoai } from "./_data";

const labelCls = "block text-[12px] font-medium text-gray-500 mb-0.5";

interface ViewModalProps {
  item: PhanLoai | null;
  onClose: () => void;
  onEdit: (item: PhanLoai) => void;
}

export default function ViewModal({ item, onClose, onEdit }: ViewModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen onClose={onClose} title="Chi tiết loại hình cơ sở">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={labelCls}>Mã loại hình</p>
            <p className="text-[14px] font-mono font-semibold text-gray-800 dark:text-gray-100">{item.maPL}</p>
          </div>
          <div>
            <p className={labelCls}>Trạng thái</p>
            <Badge variant={item.trangThai === "Hoạt động" ? "success" : "neutral"}>{item.trangThai}</Badge>
          </div>
        </div>

        <div>
          <p className={labelCls}>Tên loại hình</p>
          <p className="text-[14px] text-gray-800 dark:text-gray-100 font-medium">{item.tenPhanLoai}</p>
        </div>

        <div>
          <p className={labelCls}>Mô tả</p>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">{item.moTa || "—"}</p>
        </div>

        <div>
          <p className={labelCls}>Nhóm sản phẩm áp dụng</p>
          {item.nhomSanPhamNames.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {item.nhomSanPhamNames.map((name) => (
                <span
                  key={name}
                  className="text-[12px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-lg font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 italic">Chưa có nhóm sản phẩm</p>
          )}
        </div>

        <div>
          <p className={labelCls}>Số cơ sở thuộc loại hình</p>
          {item.soCoSo === 0 ? (
            <p className="text-[13px] text-gray-400 italic">Chưa có cơ sở nào</p>
          ) : (
            <p className="text-[14px] font-semibold text-brand-600">{item.soCoSo.toLocaleString("vi-VN")} cơ sở</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => { onClose(); onEdit(item); }}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </Modal>
  );
}
