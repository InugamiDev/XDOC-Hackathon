import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_BASE_URL = process.env.NEXT_API_URL;
const genai = new GoogleGenerativeAI(`${process.env.NEXT_GEMINI_API_KEY}`);
const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });
interface DiabetesData {
  BMI: number;
  AGE: number;
  Urea: number;
  Cr: number;
  HbA1c: number;
  Chol: number;
  TG: number;
  HDL: number;
  LDL: number;
  VLDL: number;
}

interface ShapValues {
  HbA1c: string;
  TG: string;
  VLDL: string;
  Chol: string;
  BMI: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { BMI, AGE, Urea, Cr, HbA1c, Chol, TG, HDL, LDL, VLDL } = body;

    // Validate input
    if (!BMI || !AGE || !Urea || !Cr || !HbA1c || !Chol || !TG || !HDL || !LDL || !VLDL) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Call external API for prediction
    const apiResponse = await fetch(`${API_BASE_URL}/api/diagnosis/predict/diabetes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json(
        { error: errorData.detail || "Lỗi khi gọi API" },
        { status: apiResponse.status }
      );
    }

    const apiResult = await apiResponse.text();
    const prediction = apiResult.toLowerCase().includes("high") ? "High Risk" : "Low Risk";
    const trustScore = Math.random() * (95 - 75) + 75; // Mock trust score between 75-95%

    // Generate SHAP values (mock data for demonstration)
    const shapValues = {
      HbA1c: ((HbA1c - 5.7) * -0.5).toFixed(3),
      TG: ((TG - 150) * -0.003).toFixed(3),
      VLDL: ((VLDL - 30) * -0.01).toFixed(3),
      Chol: ((Chol - 200) * -0.001).toFixed(3),
      BMI: ((BMI - 25) * 0.02).toFixed(3),
    };

    // Get AI explanation
    const explanation = await getAIExplanation(body as DiabetesData, prediction, trustScore, shapValues);

    return NextResponse.json({
      prediction,
      trustScore,
      explanation,
      apiResult,
    });
  } catch (error) {
    console.error("Error in diabetes prediction:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

async function getAIExplanation(data: DiabetesData, prediction: string, trustScore: number, shapValues: ShapValues) {
  const prompt = `
    Với vai trò là trợ lý AI y tế, hãy phân tích các thông số sức khỏe sau và cung cấp phân tích chi tiết bằng tiếng Việt:

    Thông tin bệnh nhân:
    - BMI: ${data.BMI} kg/m² (SHAP: ${shapValues.BMI})
    - Tuổi: ${data.AGE} tuổi
    - HbA1c: ${data.HbA1c}% (SHAP: ${shapValues.HbA1c})
    - Cholesterol: ${data.Chol} mg/dL (SHAP: ${shapValues.Chol})
    - Triglycerides: ${data.TG} mg/dL (SHAP: ${shapValues.TG})
    - HDL: ${data.HDL} mg/dL
    - LDL: ${data.LDL} mg/dL
    - VLDL: ${data.VLDL} mg/dL (SHAP: ${shapValues.VLDL})
    - Ure: ${data.Urea} mg/dL
    - Creatinine: ${data.Cr} mg/dL

    Dự đoán: ${prediction === "High Risk" ? "Nguy cơ cao" : "Nguy cơ thấp"}
    Độ tin cậy: ${trustScore.toFixed(1)}%

    Hãy cung cấp phân tích theo cấu trúc sau (bằng Markdown):
    Nhớ rằng không cần nói những câu tương tự như vầy: "Tuyệt vời! Dưới đây là phân tích chi tiết về các thông số sức khỏe bạn cung cấp, được trình bày theo cấu trúc Markdown như yêu cầu:"
    1. Kết quả dự đoán và độ tin cậy
    2. Chi tiết từng chỉ số chính và giá trị SHAP:
       - Giải thích ý nghĩa giá trị
       - Ý nghĩa lâm sàng
       - Mức độ ảnh hưởng đến kết quả dự đoán
       - Trình bày ngắn gọn, inline khi cần.
    3. Khuyến nghị và lưu ý:
       - Các yếu tố cần theo dõi
       - Đề xuất biện pháp cải thiện
    4. Có thể mắc bệnh
       - Nguy cơ mắc các bệnh nào, dựa theo yếu tố gì.

    Hãy đảm bảo:
    - Sử dụng ngôn ngữ dễ hiểu cho người không chuyên
    - Đánh dấu **in đậm** các giá trị quan trọng
    - Dùng bullet point dạng markdown khi cần.
    - Trình bày rõ ràng và có cấu trúc
    - Giải thích chi tiết về giá trị SHAP và ý nghĩa của chúng
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}