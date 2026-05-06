import Modal from "@/components/ui/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { PhanLoai } from "./_data";

interface DeleteModalProps {
  item: PhanLoai | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({ item, onConfirm, onClose }: DeleteModalProps) {
  if (!item) return null;

  const canDelete = item.soCoSo === 0;

  return (
    <Modal isOpen onClose={onClose} title={canDelete ? "Xác nhận xoá" : "Không thể xoá"}>
      {canDelete ? (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div>
              <p className="text-[14px] text-gray-700">
                Bạn có chắc muốn xoá loại hình cơ sở{" "}
                <span className="font-semibold text-gray-900">{item.tenPhanLoai}</span>{" "}
                (<span className="font-mono text-[13px]">{item.maPL}</span>)?
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
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div>
              <p className="text-[14px] text-gray-700">
                Không thể xoá loại hình cơ sở{" "}
                <span className="font-semibold text-gray-900">{item.tenPhanLoai}</span>.
              </p>
              <p className="mt-1 text-[13px] text-gray-500">
                Hiện có{" "}
                <span className="font-semibold text-gray-700">{item.soCoSo.toLocaleString("vi-VN")}</span>{" "}
                cơ sở đang thuộc loại hình này. Vui lòng chuyển hoặc xoá các cơ sở đó trước khi xoá loại hình.
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
