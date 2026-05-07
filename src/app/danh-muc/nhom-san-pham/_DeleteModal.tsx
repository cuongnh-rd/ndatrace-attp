import Modal from "@/components/ui/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { NhomSanPham } from "./_data";

interface DeleteModalProps {
  item: NhomSanPham | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({ item, onConfirm, onClose }: DeleteModalProps) {
  if (!item) return null;

  const canDelete = item.so_loai_hinh === 0;

  return (
    <Modal isOpen onClose={onClose} title={canDelete ? "Xác nhận xóa" : "Không thể xóa"}>
      {canDelete ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-[14px] text-gray-700">
                Bạn có chắc muốn xóa nhóm sản phẩm{" "}
                <span className="font-semibold text-gray-900">{item.name}</span>{" "}
                (<span className="font-mono text-[13px]">{item.code}</span>)?
              </p>
              <p className="mt-1 text-[13px] text-gray-500">Hành động này không thể hoàn tác.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[14px] text-gray-700">
                Không thể xóa nhóm sản phẩm{" "}
                <span className="font-semibold text-gray-900">{item.name}</span>.
              </p>
              <p className="mt-1 text-[13px] text-gray-500">
                Hiện có{" "}
                <span className="font-semibold text-gray-700">{item.so_loai_hinh}</span>{" "}
                loại hình cơ sở đang liên kết. Vui lòng gỡ liên kết trước khi xóa.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
