import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Công Cụ Đánh Giá Nguy Cơ Sức Khỏe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/diagnosis/diabetes" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>Đánh Giá Nguy Cơ Tiểu Đường</CardTitle>
                <CardDescription>
                  Đánh giá nguy cơ tiểu đường của bạn sử dụng các chỉ số sinh học và phân tích AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Phân tích các yếu tố bao gồm:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                  <li>Chỉ số HbA1c</li>
                  <li>Các chỉ số đường huyết</li>
                  <li>Bộ chỉ số mỡ máu</li>
                  <li>Chỉ số BMI và độ tuổi</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/diagnosis/cardiovascular" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>Đánh Giá Nguy Cơ Tim Mạch</CardTitle>
                <CardDescription>
                  Đánh giá sức khỏe tim mạch của bạn dựa trên các chỉ số sức khỏe toàn diện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Phân tích các yếu tố bao gồm:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                  <li>Huyết áp</li>
                  <li>Lối sống</li>
                  <li>Tiền sử gia đình</li>
                  <li>Các chỉ số sinh học</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p className="mt-2">
            Lưu ý: Công cụ này chỉ mang tính chất tham khảo/hỗ trợ và không thay thế cho tư vấn y tế chuyên nghiệp.
          </p>
        </footer>
      </div>
    </main>
  );
}
