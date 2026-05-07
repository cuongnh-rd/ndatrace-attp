import Modal from "@/components/ui/Modal";
import { ADMINISTRATIVE_UNITS, EMPTY_FORM, NspStatus } from "./_data";

const inputCls = "w-full px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors";
const labelCls = "block text-[13px] font-medium text-gray-700 mb-1";

interface NhomSanPhamModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  formData: typeof EMPTY_FORM;
  errors: Record<string, string>;
  onChange: (patch: Partial<typeof EMPTY_FORM>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function NhomSanPhamModal({ mode, isOpen, formData, errors, onChange, onSave, onClose }: NhomSanPhamModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Thêm nhóm sản phẩm" : "Chỉnh sửa nhóm sản phẩm"}
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>
            Mã nhóm sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            disabled={mode === "edit"}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="VD: NSP_YT_001"
            className={`${inputCls} ${mode === "edit" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.code && <p className="mt-1 text-[12px] text-red-500">{errors.code}</p>}
          {mode === "add" && (
            <p className="mt-1 text-[11px] text-gray-400">
              Gợi ý: NSP_YT_001 (Y tế), NSP_NN_001 (NN&MT), NSP_CT_001 (Công Thương)
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>
            Tên nhóm sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Nhập tên nhóm sản phẩm"
            className={inputCls}
          />
          {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className={labelCls}>
            Đơn vị quản lý <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.administrative_unit}
            onChange={(e) => onChange({ administrative_unit: e.target.value })}
            className={inputCls}
          >
            <option value="">-- Chọn Bộ/Cơ quan --</option>
            {ADMINISTRATIVE_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          {errors.administrative_unit && (
            <p className="mt-1 text-[12px] text-red-500">{errors.administrative_unit}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Mô tả nghiệp vụ (tùy chọn)"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {mode === "edit" && (
          <div>
            <label className={labelCls}>Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => onChange({ status: e.target.value as NspStatus })}
              className={inputCls}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
          >
            {mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
