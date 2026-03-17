"use client";

import { useState } from "react";
import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("thong-tin");

  const productDetail = {
    id: "SP202401001",
    name: "Cà phê rang xay Cao Nguyên",
    category: "Thực phẩm",
    unit: "gói",
    company: "Công ty Cà phê Đắk Lắk",
    status: "active",
    description: "Cà phê rang xay 100% Robusta từ vùng đất đỏ Bazan Đắk Lắk, sản phẩm đạt chuẩn OCOP 3 sao, được bảo quản trong điều kiện tiêu chuẩn",
    manufacturingLocation: "Lâm Đồng, Việt Nam",
    productionDate: "2024-01-15",
    expiryDays: 365,
    shelfLife: "12 tháng",
    certifications: ["OCOP 3 sao", "HACCP", "ISO 22000"],
    uid: "8920240123010001",
    qrCode: "QR2024012300001",
  };

  const batches = [
    { id: "LO202403001", quantity: 500, productionDate: "2024-03-01", expiryDate: "2025-03-01", status: "warehouse" },
    { id: "LO202403002", quantity: 300, productionDate: "2024-03-05", expiryDate: "2025-03-05", status: "delivered" },
    { id: "LO202403003", quantity: 400, productionDate: "2024-03-10", expiryDate: "2025-03-10", status: "in-transit" },
  ];

  const traceabilityEvents = [
    { date: "2024-03-10", event: "Sản xuất", location: "Nhà máy Lam Đồng", details: "Lô LO202403003" },
    { date: "2024-03-12", event: "Kiểm định", location: "Trung tâm ATTP", details: "Đạt chuẩn" },
    { date: "2024-03-13", event: "Vận chuyển", location: "Kho Hà Nội", details: "Xe tải 34B-12345" },
    { date: "2024-03-14", event: "Lưu kho", location: "Kho Hà Nội", details: "Khu vực A, Hàng số 5" },
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
    { key: "thong-tin", label: "Thông tin cơ bản" },
    { key: "lo-hang", label: "Lô hàng" },
    { key: "truy-xuat", label: "Truy xuất nguồn gốc" },
    { key: "chung-chi", label: "Chứng nhận" },
  ];

  return (
    <SectionPage
      title="Chi tiết sản phẩm"
      subtitle={`Mã sản phẩm: ${productDetail.id}`}
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
              <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên sản phẩm:</span>
                  <span className="font-medium">{productDetail.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{productDetail.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đơn vị:</span>
                  <span className="font-medium">{productDetail.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doanh nghiệp:</span>
                  <span className="font-medium">{productDetail.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa điểm sản xuất:</span>
                  <span className="font-medium">{productDetail.manufacturingLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày SX gần nhất:</span>
                  <span className="font-medium">{productDetail.productionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn sử dụng:</span>
                  <span className="font-medium">{productDetail.shelfLife}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant="success">Đang bán</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Mã định danh</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">UID:</span>
                  <span className="font-mono font-medium">{productDetail.uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã QR:</span>
                  <span className="font-mono font-medium">{productDetail.qrCode}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Mô tả sản phẩm</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{productDetail.description}</p>
            </Card>
          </div>
        )}

        {selectedTab === "lo-hang" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Danh sách lô hàng</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mã lô</th>
                  <th className="text-left py-2">Số lượng</th>
                  <th className="text-left py-2">Ngày SX</th>
                  <th className="text-left py-2">Hạn SD</th>
                  <th className="text-left py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b">
                    <td className="py-3">{batch.id}</td>
                    <td>{batch.quantity}</td>
                    <td>{batch.productionDate}</td>
                    <td>{batch.expiryDate}</td>
                    <td>
                      <Badge variant={statusMap[batch.status]}>{statusLabel[batch.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {selectedTab === "truy-xuat" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Lịch sử truy xuất nguồn gốc</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {traceabilityEvents.map((event, index) => (
                <div key={index} className="relative pl-10 pb-6">
                  <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{event.event}</h4>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedTab === "chung-chi" && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Chứng nhận đạt được</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productDetail.certifications.map((cert) => (
                <div key={cert} className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📜</div>
                  <div className="font-semibold">{cert}</div>
                  <div className="text-sm text-gray-500 mt-1">Hiệu lực: Đến 2025</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </SectionPage>
  );
}
