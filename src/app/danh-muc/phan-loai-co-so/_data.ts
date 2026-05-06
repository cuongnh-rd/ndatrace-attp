export interface PhanLoai {
  maPL: string;
  tenPhanLoai: string;
  moTa: string;
  soCoSo: number;
  trangThai: string;
  nhomSanPhamIds: string[];
  nhomSanPhamNames: string[];
}

export const NSP_OPTIONS = [
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

export const initialData: PhanLoai[] = [
  { maPL: "PL-001", tenPhanLoai: "Nhà hàng, quán ăn", moTa: "Cơ sở kinh doanh dịch vụ ăn uống tại chỗ", soCoSo: 3420, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_001"], nhomSanPhamNames: ["Nước giải khát", "Bia"] },
  { maPL: "PL-002", tenPhanLoai: "Bếp ăn tập thể", moTa: "Bếp ăn phục vụ từ 30 suất/ngày trở lên tại trường học, khu công nghiệp", soCoSo: 892, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], nhomSanPhamNames: ["Ngũ cốc", "Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-003", tenPhanLoai: "Cơ sở sản xuất thực phẩm", moTa: "Cơ sở chế biến, sản xuất thực phẩm đóng gói, đóng hộp", soCoSo: 645, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_003", "NSP_CT_003"], nhomSanPhamNames: ["Phụ gia thực phẩm", "Sữa chế biến"] },
  { maPL: "PL-004", tenPhanLoai: "Thức ăn đường phố", moTa: "Cơ sở kinh doanh thức ăn lưu động, xe đẩy, quầy vỉa hè", soCoSo: 7841, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-005", tenPhanLoai: "Siêu thị, cửa hàng tiện lợi", moTa: "Cơ sở bán lẻ thực phẩm đóng gói và thực phẩm tươi sống", soCoSo: 1203, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003", "NSP_NN_001"], nhomSanPhamNames: ["Nước giải khát", "Sữa chế biến", "Ngũ cốc"] },
  { maPL: "PL-006", tenPhanLoai: "Chợ truyền thống", moTa: "Cơ sở kinh doanh thực phẩm tươi sống tại chợ đầu mối, chợ dân sinh", soCoSo: 2156, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002", "NSP_NN_003"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt", "Thủy sản"] },
  { maPL: "PL-007", tenPhanLoai: "Cơ sở sản xuất nước uống", moTa: "Sản xuất nước đóng chai, nước tinh khiết, nước khoáng thiên nhiên", soCoSo: 178, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_001"], nhomSanPhamNames: ["Nước uống đóng chai"] },
  { maPL: "PL-008", tenPhanLoai: "Cơ sở chế biến hải sản", moTa: "Cơ sở sơ chế, chế biến, bảo quản hải sản tươi sống và đông lạnh", soCoSo: 312, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_003"], nhomSanPhamNames: ["Thủy sản"] },
  { maPL: "PL-009", tenPhanLoai: "Cơ sở giết mổ gia súc, gia cầm", moTa: "Lò giết mổ gia súc, gia cầm theo quy mô công nghiệp và thủ công", soCoSo: 45, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002"], nhomSanPhamNames: ["Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-010", tenPhanLoai: "Cơ sở kinh doanh phụ gia thực phẩm", moTa: "Kinh doanh, phân phối phụ gia và hóa chất dùng trong thực phẩm", soCoSo: 234, trangThai: "Không hoạt động", nhomSanPhamIds: ["NSP_YT_003"], nhomSanPhamNames: ["Phụ gia thực phẩm"] },
  { maPL: "PL-011", tenPhanLoai: "Căng tin trường học", moTa: "Cơ sở phục vụ ăn uống trong khuôn viên trường mầm non, tiểu học, THCS, THPT", soCoSo: 567, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], nhomSanPhamNames: ["Ngũ cốc", "Thịt và sản phẩm từ thịt"] },
  { maPL: "PL-012", tenPhanLoai: "Cơ sở nhập khẩu thực phẩm", moTa: "Doanh nghiệp nhập khẩu, phân phối thực phẩm có nguồn gốc nước ngoài", soCoSo: 89, trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003"], nhomSanPhamNames: ["Nước giải khát", "Sữa chế biến"] },
];

export const EMPTY_FORM = {
  maPL: "",
  tenPhanLoai: "",
  moTa: "",
  trangThai: "Hoạt động" as string,
  nhomSanPhamIds: [] as string[],
};

export function generateMaPL(data: PhanLoai[]): string {
  const maxNum = data.reduce((max, d) => {
    const n = parseInt(d.maPL.replace("PL-", ""), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return `PL-${String(maxNum + 1).padStart(3, "0")}`;
}
