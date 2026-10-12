import { redirect } from "next/navigation";

/** Menu cũ "Mẫu sự kiện trọng yếu" đã đổi thành "Quy trình tiêu chuẩn TXNG" */
export default function Page() {
    redirect("/danh-muc/quy-trinh-tieu-chuan");
}
