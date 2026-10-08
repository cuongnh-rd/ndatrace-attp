// Dữ liệu mô phỏng (mock tĩnh) cho tab Tổng quan — mỗi menu một file.
// Thứ tự trong MODS là thứ tự hiển thị bộ lọc module trên màn Cảnh báo.
import type { Mod } from "../types";
import { doanhNghiep } from "./doanh-nghiep";
import { coSo } from "./co-so";
import { sanPham } from "./san-pham";
import { loSanPham } from "./lo-san-pham";
import { bangChungSoUid } from "./bang-chung-so-uid";
import { chungChiSoSuKien } from "./chung-chi-so-su-kien";
import { phanAnhSanPham } from "./phan-anh-san-pham";
import { giayChungNhan } from "./giay-chung-nhan";
import { hoSoTuCongBo } from "./ho-so-tu-cong-bo";
import { kiemTraAttp } from "./kiem-tra-attp";
import { ngoDocThucPham } from "./ngo-doc-thuc-pham";
import { truyenThongAttp } from "./truyen-thong-attp";
import { boBanNganh } from "./bo-ban-nganh";
import { doiTac } from "./doi-tac";
import { nguoiDung } from "./nguoi-dung";
import { vaiTro } from "./vai-tro";
import { mauSuKienTrongYeu } from "./mau-su-kien-trong-yeu";
import { thuVienMauSuKien } from "./thu-vien-mau-su-kien";
import { truongDuLieu } from "./truong-du-lieu";
import { loaiChungChi } from "./loai-chung-chi";
import { donViHanhChinh } from "./don-vi-hanh-chinh";
import { nhomNganhHang } from "./nhom-nganh-hang";
import { nhomSanPham } from "./nhom-san-pham";
import { phanLoaiCoSo } from "./phan-loai-co-so";
import { mucDoRuiRo } from "./muc-do-rui-ro";
import { suKienTichHop } from "./su-kien-tich-hop";
import { nhatKyGiaoDich } from "./nhat-ky-giao-dich";

export const MODS: Mod[] = [
  doanhNghiep,
  coSo,
  sanPham,
  loSanPham,
  bangChungSoUid,
  chungChiSoSuKien,
  phanAnhSanPham,
  giayChungNhan,
  hoSoTuCongBo,
  kiemTraAttp,
  ngoDocThucPham,
  truyenThongAttp,
  boBanNganh,
  doiTac,
  nguoiDung,
  vaiTro,
  mauSuKienTrongYeu,
  thuVienMauSuKien,
  truongDuLieu,
  loaiChungChi,
  donViHanhChinh,
  nhomNganhHang,
  nhomSanPham,
  phanLoaiCoSo,
  mucDoRuiRo,
  suKienTichHop,
  nhatKyGiaoDich,
];
