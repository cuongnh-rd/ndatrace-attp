# Báo cáo thống kê - Data Samples

Thư mục chứa các mẫu dữ liệu cho tính năng "Báo cáo thống kê" trong hệ thống NDATrace.

## Các loại báo cáo có sẵn

### 1. Báo cáo cơ sở (`co-so-sample-data.ts`)
Thống kê và báo cáo tình hình cơ sở kinh doanh thực phẩm.

**Dữ liệu bao gồm:**
- Tổng quan số liệu (tổng cơ sở, cơ sở có chứng nhận, vi phạm, tỷ lệ tuân thủ)
- Phân loại theo loại hình cơ sở (nhà hàng, cửa hàng, xưởng, chợ, kho, vận chuyển)
- Phân loại theo khu vực (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, v.v.)
- Xu hướng theo thời gian (12 tháng)
- Thống kê vi phạm theo danh mục

### 2. Báo cáo giấy ATTP (`giay-attp-sample-data.ts`)
Thống kê giấy chứng nhận an toàn thực phẩm.

**Dữ liệu bao gồm:**
- Tổng quan số liệu (giấy chứng nhận, sắp hết hạn, đã gia hạn, đã thu hồi)
- Phân loại theo loại giấy chứng nhận
- Phân loại theo ngành nghề
- Xu hướng cấp phát theo thời gian
- Danh sách giấy sắp hết hạn
- Thống kê gia hạn

### 3. Báo cáo kiểm tra (`kiem-tra-sample-data.ts`)
Thống kê kết quả kiểm tra an toàn thực phẩm.

**Dữ liệu bao gồm:**
- Tổng quan số liệu (tổng đợt kiểm tra, đạt, không đạt, tỷ lệ đạt chuẩn)
- Phân loại theo loại kiểm tra (định kỳ, đột xuất, sau khiếu nại, theo yêu cầu)
- Thống kê theo mức độ vi phạm
- Xu hướng kiểm tra theo thời gian
- Các vi phạm phổ biến
- Danh sách kiểm tra gần đây
- Phân loại theo khu vực

### 4. Báo cáo ngộ độc (`ngo-doc-sample-data.ts`)
Thống kê các vụ ngộ độc thực phẩm.

**Dữ liệu bao gồm:**
- Tổng quan số liệu (số vụ, số người, tử vong, tỷ lệ xử lý)
- Phân loại theo nguyên nhân (vi khuẩn, độc tố, hóa chất, nấm độc)
- Phân loại theo địa điểm (nhà hàng, gia đình, bếp ăn tập thể, v.v.)
- Xu hướng ngộ độc theo thời gian
- Phân loại theo khu vực
- Danh sách vụ ngộ độc gần đây
- Phân loại theo loại thực phẩm
- Thống kê thời gian xử lý

### 5. Báo cáo truyền thông (`truyen-thong-sample-data.ts`)
Thống kê hoạt động truyền thông an toàn thực phẩm.

**Dữ liệu bao gồm:**
- Tổng quan số liệu (chiến dịch, bài đăng, lượt tiếp cận, tương tác)
- Phân loại theo kênh (Facebook, YouTube, TikTok, Website, Zalo)
- Phân loại theo chủ đề
- Xu hướng hoạt động theo thời gian
- Danh sách chiến dịch gần đây
- Bài đăng hiệu quả nhất
- Thống kê khán giả
- Phân loại theo khu vực
- Thống kê tương tác theo loại nội dung

## Cách sử dụng

### Import dữ liệu

```typescript
import {
  facilitySummaryCards,
  facilityByType,
  certificateSummaryCards,
  inspectionTrendData,
  poisoningByCause,
  communicationSummaryCards,
  REPORT_DATA_SUMMARY
} from '@/data/reports';

// Hoặc import tất cả
import * as reportData from '@/data/reports';
```

### Ví dụ sử dụng trong component

```typescript
import DashboardLayout from "@/components/layout/DashboardLayout";
import { facilitySummaryCards, facilityByType } from "@/data/reports";

export default function CoSoReportPage() {
  return (
    <DashboardLayout>
      {/* Hiển thị summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {facilitySummaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[14px] text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className={`text-[14px] mt-1 ${card.up ? "text-green-600" : "text-red-500"}`}>
              {card.change} so với tháng trước
            </p>
          </div>
        ))}
      </div>

      {/* Hiển thị biểu đồ với dữ liệu */}
      {/* ... */}
    </DashboardLayout>
  );
}
```

### Sử dụng với các biểu图表 (Recharts)

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { facilityByType } from "@/data/reports";

// Trong component
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={facilityByType}>
    <XAxis dataKey="type" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="total" fill="#1570EF" />
    <Bar dataKey="certified" fill="#22c55e" />
  </BarChart>
</ResponsiveContainer>
```

## Đặc điểm dữ liệu

- **Thực tế**: Dữ liệu mô phỏng dựa trên các báo cáo thực tế về an toàn thực phẩm
- **Đa dạng**: Bao gồm các loại thống kê khác nhau (tổng quan, phân loại, xu hướng)
- **Đồng bộ**: Số liệu có liên quan giữa các loại báo cáo
- **Đầy đủ**: Bao gồm các trường thông tin cần thiết cho biểu图表 và bảng dữ liệu

## Mở rộng

Để thêm dữ liệu cho các loại báo cáo mới:

1. Tạo file mới trong thư mục `src/data/reports/`
2. Export các mảng dữ liệu
3. Thêm vào `index.ts` để export và document
4. Cập nhật `REPORT_DATA_SUMMARY` trong `index.ts`

## Lưu ý

- Dữ liệu mẫu chỉ phục vụ mục đích phát triển và demo
- Trong production, dữ liệu sẽ được lấy từ API backend
- Các số liệu trong dữ liệu mẫu là giả định và không phản ánh thực tế
