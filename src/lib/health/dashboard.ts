// Dữ liệu màn Dashboard: health card, biểu đồ phân tích và bảng xếp hạng lấy từ các module.
import type { Leader } from "./types";

/** Health card hiển thị trên Dashboard: [module, card id] */
export const DKEY: [string, string][] = [
  ["uid", "H1"],
  ["sp", "H1"],
  ["dn", "H2"],
  ["sk", "H1"],
  ["sk", "H2"],
  ["cc", "H5"],
  ["bo", "H1"],
  ["bo", "H2"],
];
/** Biểu đồ phân tích trên Dashboard: [chart id, các card D1..D8 mà biểu đồ giải thích] */
export const DMAP: [string, string[]][] = [
  ["uidR", ["D1"]],
  ["uid7", ["D1"]],
  ["spW", ["D2"]],
  ["sp1", ["D2"]],
  ["dnW", ["D3"]],
  ["dnU", ["D3"]],
  ["sk5", ["D4"]],
  ["skU", ["D4"]],
  ["sk4", ["D5"]],
  ["skD", ["D5"]],
  ["cc1", ["D6"]],
  ["bo1", ["D7"]],
  ["bo8", ["D8"]],
  ["bo9", ["D8"]],
];
export const LB: Leader[] = [
  {
    t: "Doanh nghiệp có tỉ lệ UID đạt đủ công đoạn cao nhất",
    f: "UID đạt đủ công đoạn / UID đã kích hoạt trong tháng; chỉ xét doanh nghiệp có ≥ 1.000 UID kích hoạt.",
    cols: ["Doanh nghiệp", "Tỉnh/thành", "Tỉ lệ đạt"],
    rows: [
      ["CTCP Sữa TH", "Nghệ An", "97%"],
      ["Cty Nông sản Đà Lạt Xanh", "Lâm Đồng", "94%"],
      ["Cty CP Sữa Ba Vì", "Hà Nội", "92%"],
      ["HTX Chè Mộc Châu", "Sơn La", "89%"],
      ["Lafooco", "Long An", "86%"],
    ],
  },
  {
    t: "Tỉnh/thành dẫn đầu về tỉ lệ UID đạt đủ công đoạn",
    f: "UID đạt đủ công đoạn / UID đã kích hoạt của doanh nghiệp có trụ sở tại tỉnh, trong tháng.",
    cols: ["Tỉnh/thành", "Doanh nghiệp", "Tỉ lệ đạt"],
    rows: [
      ["Hà Nội", 124, "78%"],
      ["TP. Hồ Chí Minh", 98, "74%"],
      ["Lâm Đồng", 52, "72%"],
      ["Đà Nẵng", 46, "71%"],
      ["Hải Phòng", 39, "69%"],
    ],
  },
  {
    t: "Doanh nghiệp tiến bộ nhất tháng",
    f: "Mức tăng tỉ lệ UID đạt đủ công đoạn so với cùng kỳ tháng trước (điểm %); doanh nghiệp có ≥ 1.000 UID kích hoạt.",
    cols: ["Doanh nghiệp", "Tháng trước → tháng này", "Tăng"],
    rows: [
      ["HTX Phước An", "58% → 79%", "+21"],
      ["Cty TP Hữu Nghị", "61% → 77%", "+16"],
      ["Thủy sản Cửu Long", "55% → 68%", "+13"],
      ["Cty CP Tech Brand", "46% → 58%", "+12"],
      ["HTX Rau sạch Đông Anh", "52% → 62%", "+10"],
    ],
  },
  {
    t: "Bộ ngành ban hành tiêu chuẩn tích cực nhất",
    f: "Xếp theo số quy trình tiêu chuẩn TXNG đang áp dụng; kèm tỉ lệ nhóm hàng thuộc phạm vi đã có quy trình.",
    cols: ["Cơ quan", "Quy trình đang áp dụng", "Nhóm hàng đã có quy trình"],
    rows: [
      ["Bộ NN&MT", 26, "81%"],
      ["Bộ Y tế", 14, "62%"],
      ["Bộ Công Thương", 12, "43%"],
      ["Bộ KH&CN", 8, "–"],
    ],
  },
  {
    t: "Đơn vị triển khai hiệu quả nhất",
    f: "Xếp theo số doanh nghiệp hoạt động (khai báo trong 30 ngày); kèm tỉ lệ chuyển đổi.",
    cols: ["Đơn vị", "DN hoạt động", "Chuyển đổi"],
    rows: [
      ["TrangNTT", 94, "73%"],
      ["ThanhTP", 58, "67%"],
      ["Checkee", 41, "82%"],
      ["Test Đại Lý 01", 31, "57%"],
    ],
  },
];
