import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/ui/MultiSelect";
import { EMPTY_FORM, NSP_OPTIONS } from "./_data";

const inputCls = "w-full px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors";
const labelCls = "block text-[13px] font-medium text-gray-700 mb-1";

interface PhanLoaiModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  formData: typeof EMPTY_FORM;
  errors: Record<string, string>;
  onChange: (patch: Partial<typeof EMPTY_FORM>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function PhanLoaiModal({ mode, isOpen, formData, errors, onChange, onSave, onClose }: PhanLoaiModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Thêm loại hình cơ sở" : "Chỉnh sửa loại hình cơ sở"}
    >
      <div className="space-y-4">
        {mode === "add" && (
          <div>
            <label className={labelCls}>Mã loại hình</label>
            <input
              type="text"
              value={formData.maPL}
              onChange={(e) => onChange({ maPL: e.target.value })}
              placeholder="Tự động tạo nếu bỏ trống"
              className={inputCls}
            />
            {errors.maPL && <p className="mt-1 text-[12px] text-red-500">{errors.maPL}</p>}
          </div>
        )}

        <div>
          <label className={labelCls}>
            Tên loại hình<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tenPhanLoai}
            onChange={(e) => onChange({ tenPhanLoai: e.target.value })}
            className={inputCls}
          />
          {errors.tenPhanLoai && <p className="mt-1 text-[12px] text-red-500">{errors.tenPhanLoai}</p>}
        </div>

        <div>
          <label className={labelCls}>Mô tả</label>
          <textarea
            value={formData.moTa}
            onChange={(e) => onChange({ moTa: e.target.value })}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Trạng thái</label>
          <select
            value={formData.trangThai}
            onChange={(e) => onChange({ trangThai: e.target.value })}
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
            onChange={(v) => onChange({ nhomSanPhamIds: v })}
            placeholder="Chọn nhóm sản phẩm..."
          />
          {errors.nhomSanPhamIds && <p className="mt-1 text-[12px] text-red-500">{errors.nhomSanPhamIds}</p>}
        </div>

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
