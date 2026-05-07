export type NspStatus = "ACTIVE" | "INACTIVE";

export interface NhomSanPham {
  id: string;
  code: string;
  name: string;
  administrative_unit: string;
  description: string;
  status: NspStatus;
  so_loai_hinh: number;
}

export const ADMINISTRATIVE_UNITS = [
  "Bộ Quốc phòng",
  "Bộ Công an",
  "Bộ Ngoại giao",
  "Bộ Nội vụ",
  "Bộ Tư pháp",
  "Bộ Tài chính",
  "Bộ Công Thương",
  "Bộ Nông nghiệp và Môi trường",
  "Bộ Xây dựng",
  "Bộ Khoa học và Công nghệ",
  "Bộ Văn hóa, Thể thao và Du lịch",
  "Bộ Y tế",
  "Bộ Giáo dục và Đào tạo",
  "Bộ Dân tộc và Tôn giáo",
];

export const STATUS_LABEL_MAP: Record<string, NspStatus> = {
  "Hoạt động": "ACTIVE",
  "Không hoạt động": "INACTIVE",
};

export const initialData: NhomSanPham[] = [
  { id: "1", code: "NSP_YT_001", name: "Nước uống đóng chai", administrative_unit: "Bộ Y tế", description: "Nước đóng chai, nước tinh khiết, nước khoáng thiên nhiên", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "2", code: "NSP_YT_002", name: "Thực phẩm chức năng", administrative_unit: "Bộ Y tế", description: "Thực phẩm bổ sung vi chất, thực phẩm bảo vệ sức khỏe", status: "ACTIVE", so_loai_hinh: 3 },
  { id: "3", code: "NSP_YT_003", name: "Phụ gia thực phẩm", administrative_unit: "Bộ Y tế", description: "Các chất phụ gia, hóa chất sử dụng trong chế biến thực phẩm", status: "ACTIVE", so_loai_hinh: 1 },
  { id: "4", code: "NSP_YT_004", name: "Vi chất bổ sung vào thực phẩm", administrative_unit: "Bộ Y tế", description: "Vitamin, khoáng chất và vi chất dinh dưỡng bổ sung vào thực phẩm", status: "INACTIVE", so_loai_hinh: 0 },
  { id: "5", code: "NSP_NN_001", name: "Ngũ cốc", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Lúa gạo, ngô, mì, đại mạch và các loại ngũ cốc", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "6", code: "NSP_NN_002", name: "Thịt và sản phẩm từ thịt", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Thịt gia súc, gia cầm tươi sống và chế biến", status: "ACTIVE", so_loai_hinh: 3 },
  { id: "7", code: "NSP_NN_003", name: "Thủy sản", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Cá, tôm, cua và các loại thủy hải sản tươi sống, đông lạnh", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "8", code: "NSP_CT_001", name: "Bia", administrative_unit: "Bộ Công Thương", description: "Các loại bia sản xuất trong nước và nhập khẩu", status: "ACTIVE", so_loai_hinh: 1 },
  { id: "9", code: "NSP_CT_002", name: "Nước giải khát", administrative_unit: "Bộ Công Thương", description: "Nước ngọt, nước ép, đồ uống không cồn đóng chai/hộp", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "10", code: "NSP_CT_003", name: "Sữa chế biến", administrative_unit: "Bộ Công Thương", description: "Sữa bột, sữa đặc, sữa thanh trùng và các sản phẩm từ sữa chế biến", status: "ACTIVE", so_loai_hinh: 1 },
];

export const EMPTY_FORM = {
  code: "",
  name: "",
  administrative_unit: "",
  description: "",
  status: "ACTIVE" as NspStatus,
};
