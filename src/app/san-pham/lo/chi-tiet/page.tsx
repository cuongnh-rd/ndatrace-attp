"use client";

import { useState } from "react";
import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("thong-tin");

  const batchDetail = {
    id: "LO202403003",
    product: "Cà phê rang xay Cao Nguyên",
    productId: "SP202401001",
    company: "Công ty Cà phê Đắk Lắk",
    quantity: 400,
    unit: "gói",
    productionDate: "2024-03-10",
    expiryDate: "2025-03-10",
    status: "in-transit",
    manufacturingLocation: "Nhà máy Lam Đồng",
    currentLocation: "Kho vận chuyển Hà Nội",
    qualityScore: 98.5,
    inspectionResults: "Đạt chuẩn 100%",
    uid: "892024031030001",
    qrCode: "QR2024031030001",
  };

  const traceability = [
    { date: "2024-03-10", time: "08:30", event: "Sản xuất", location: "Nhà máy Lam Đồng", operator: "Nguyễn Văn A", details: "Lô LO202403003 - 400 gói" },
    { date: "2024-03-10", time: "14:00", event: "Kiểm định", location: "Trung tâm ATTP", operator: "Trần Thị B", details: "Kết quả: Đạt chuẩn 100%" },
    { date: "2024-03-11", time: "09:00", event: "Dán tem UID", location: "Nhà máy Lam Đồng", operator: "Lê Văn C", details: "UID: 892024031030001" },
    { date: "2024-03-11", time: "16:30", event: "Vận chuyển", location: "Kho vận chuyển", operator: "Phạm Văn D", details: "Xe tải 34B-12345" },
    { date: "2024-03-12", time: "10:15", event: "Đang vận chuyển", location: "Trên đường", operator: "Tài xế", details: "Vị trí: Km 35, QL1A" },
    { date: "2024-03-13", time: "08:00", event: "Lưu kho", location: "Kho vận chuyển Hà Nội", operator: "Hoàng Văn E", details: "Khu vực A, Hàng số 12" },
  ];

  const statusMap: Record<string, "success" | "info" | "warning" | "danger"> = {
    warehouse: "warning",
    delivered: "success",
    "in-transit": "info",
    recalled: "danger",
  };
  const statusLabel: Record<string, string> = {
    warehouse: "Trong kho",
    delivered: "Đã giao",
    "in-transit": "Đang vận chuyển",
    recalled: "Thu hồi",
  };

  const tabs = [
    { key: "thong-tin", label: "Thông tin lô hàng" },
    { key: "truy-xuat", label: "Truy xuất nguồn gốc" },
    { key: "kiem-dinh", label: "Kết quả kiểm định" },
  ];

  return (
    <SectionPage
      title="Chi tiết lô hàng"
      subtitle={`Mã lô: ${batchDetail.id}`}
    >
      <div className="space-y-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-4 py-2 font-medium ${
                selectedTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === "thong-tin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Thông tin lô hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã lô:</span>
                  <span className="font-mono font-medium">{batchDetail.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sản phẩm:</span>
                  <span className="font-medium">{batchDetail.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doanh nghiệp:</span>
                  <span className="font-medium">{batchDetail.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng:</span>
                  <span className="font-medium">{batchDetail.quantity} {batchDetail.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày sản xuất:</span>
                  <span className="font-medium">{batchDetail.productionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn sử dụng:</span>
                  <span className="font-medium">{batchDetail.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa điểm SX:</span>
                  <span className="font-medium">{batchDetail.manufacturingLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vị trí hiện tại:</span>
                  <span className="font-medium">{batchDetail.currentLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant={statusMap[batchDetail.status]}>{statusLabel[batchDetail.status]}</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Chất lượng & Định danh</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Điểm chất lượng:</span>
                  <span className="font-bold text-green-600">{batchDetail.qualityScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kết quả kiểm định:</span>
                  <span className="font-medium">{batchDetail.inspectionResults}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Mã định danh</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">UID:</span>
                  <span className="font-mono font-medium">{batchDetail.uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã QR:</span>
                  <span className="font-mono font-medium">{batchDetail.qrCode}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {selectedTab === "truy-xuat" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Lịch sử truy xuất nguồn gốc</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {traceability.map((item, index) => (
                <div key={index} className="relative pl-10 pb-6">
                  <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{item.event}</h4>
                      <span className="text-sm text-gray-500">{item.date} {item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Người thực hiện: {item.operator}</p>
                    <p className="text-xs text-gray-500">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedTab === "kiem-dinh" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Kết quả kiểm định</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Thông tin kiểm định</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày kiểm định:</span>
                      <span>10/03/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đơn vị kiểm định:</span>
                      <span>Trung tâm ATTP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mẫu thử:</span>
                      <span>LO202403003-01</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Kết quả</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kết quả:</span>
                      <Badge variant="success">Đạt chuẩn</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm số:</span>
                      <span className="font-bold">98.5/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chứng nhận:</span>
                      <span>HACCP, ISO 22000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Chi tiết các chỉ tiêu</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Chỉ tiêu</th>
                      <th className="text-left py-2">Giá trị đo</th>
                      <th className="text-left py-2">Giá trị chuẩn</th>
                      <th className="text-left py-2">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Độ ẩm</td>
                      <td>3.5%</td>
                      <td>≤ 5%</td>
                      <td><Badge variant="success">Đạt</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Tạp chất</td>
                      <td>0.01%</td>
                      <td>≤ 0.05%</td>
                      <td><Badge variant="success">Đạt</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Khuẩn gây bệnh</td>
                      <td>Không phát hiện</td>
                      <td>Không có</td>
                      <td><Badge variant="success">Đạt</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Chất bảo quản</td>
                      <td>Không phát hiện</td>
                      <td>Không có</td>
                      <td><Badge variant="success">Đạt</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </div>
    </SectionPage>
  );
}
