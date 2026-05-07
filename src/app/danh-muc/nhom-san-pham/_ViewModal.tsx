import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { NhomSanPham } from "./_data";

const labelCls = "block text-[12px] font-medium text-gray-500 mb-0.5";

interface ViewModalProps {
  item: NhomSanPham | null;
  onClose: () => void;
  onEdit: (item: NhomSanPham) => void;
}

export default function ViewModal({ item, onClose, onEdit }: ViewModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen onClose={onClose} title="Chi tiết nhóm sản phẩm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={labelCls}>Mã nhóm</p>
            <p className="text-[14px] font-mono font-semibold text-gray-800 dark:text-gray-100">{item.code}</p>
          </div>
          <div>
            <p className={labelCls}>Trạng thái</p>
            <Badge variant={item.status === "ACTIVE" ? "success" : "neutral"}>
              {item.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
            </Badge>
          </div>
        </div>

        <div>
          <p className={labelCls}>Tên nhóm sản phẩm</p>
          <p className="text-[14px] text-gray-800 dark:text-gray-100 font-medium">{item.name}</p>
        </div>

        <div>
          <p className={labelCls}>Đơn vị quản lý</p>
          <p className="text-[14px] text-gray-800 dark:text-gray-100">{item.administrative_unit}</p>
        </div>

        <div>
          <p className={labelCls}>Mô tả</p>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">{item.description || "—"}</p>
        </div>

        <div>
          <p className={labelCls}>Loại hình cơ sở đang liên kết</p>
          {item.so_loai_hinh === 0 ? (
            <p className="text-[13px] text-gray-400 italic">Chưa có loại hình liên kết</p>
          ) : (
            <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-[13px] text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-brand-600">{item.so_loai_hinh}</span> loại hình đang sử dụng nhóm sản phẩm này
              </p>
            </div>
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
