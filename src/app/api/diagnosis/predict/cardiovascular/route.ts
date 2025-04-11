import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_BASE_URL = process.env.NEXT_API_URL;
const genai = new GoogleGenerativeAI(`${process.env.NEXT_GEMINI_API_KEY}`);
const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

interface CardiovascularData {
  age: number;
  gender: string;
  blood_pressure: number;
  cholesterol_level: number;
  exercise_habits: string;
  smoking: string;
  family_heart_disease: string;
  diabetes: string;
  bmi: number;
  high_blood_pressure: string;
  low_hdl_cholesterol: string;
  high_ldl_cholesterol: string;
  alcohol_consumption: string;
  stress_level: string;
  sleep_hours: number;
  sugar_consumption: string;
  triglyceride_level: number;
  fasting_blood_sugar: number;
  crp_level: number;
  homocysteine_level: number;
}

interface ShapValues {
  blood_pressure: string;
  cholesterol: string;
  bmi: string;
  age: string;
  triglycerides: string;
  blood_sugar: string;
  crp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      age,
      gender,
      blood_pressure,
      cholesterol_level,
      exercise_habits,
      smoking,
      family_heart_disease,
      diabetes,
      bmi,
      high_blood_pressure,
      low_hdl_cholesterol,
      high_ldl_cholesterol,
      alcohol_consumption,
      stress_level,
      sleep_hours,
      sugar_consumption,
      triglyceride_level,
      fasting_blood_sugar,
      crp_level,
      homocysteine_level
    } = body;

    // Validate input
    const requiredFields = [
      'age', 'gender', 'blood_pressure', 'cholesterol_level',
      'exercise_habits', 'smoking', 'family_heart_disease', 'diabetes',
      'bmi', 'high_blood_pressure', 'low_hdl_cholesterol',
      'high_ldl_cholesterol', 'alcohol_consumption', 'stress_level',
      'sleep_hours', 'sugar_consumption', 'triglyceride_level',
      'fasting_blood_sugar', 'crp_level', 'homocysteine_level'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Vui lòng điền đầy đủ thông tin: ${field}` },
          { status: 400 }
        );
      }
    }

    // Call external API for prediction
    const apiResponse = await fetch(`${API_BASE_URL}/api/diagnosis/predict/cardiovascular/`, {
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
      blood_pressure: ((blood_pressure - 120) * 0.01).toFixed(3),
      cholesterol: ((cholesterol_level - 200) * 0.005).toFixed(3),
      bmi: ((bmi - 25) * 0.02).toFixed(3),
      age: ((age - 50) * 0.015).toFixed(3),
      triglycerides: ((triglyceride_level - 150) * 0.003).toFixed(3),
      blood_sugar: ((fasting_blood_sugar - 100) * 0.008).toFixed(3),
      crp: ((crp_level - 1) * 0.1).toFixed(3),
    };

    // Get AI explanation
    const explanation = await getAIExplanation(body as CardiovascularData, prediction, trustScore, shapValues);

    return NextResponse.json({
      prediction,
      trustScore,
      explanation,
      apiResult,
    });
  } catch (error) {
    console.error("Error in cardiovascular prediction:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}

async function getAIExplanation(data: CardiovascularData, prediction: string, trustScore: number, shapValues: ShapValues) {
  const prompt = `
    Với vai trò là trợ lý AI y tế, hãy phân tích các thông số sức khỏe tim mạch sau và cung cấp phân tích chi tiết bằng tiếng Việt:

    Thông tin bệnh nhân:
    * Tuổi: ${data.age} tuổi (SHAP: ${shapValues.age})
    * Giới tính: ${data.gender === "Male" ? "Nam" : "Nữ"}
    * BMI: ${data.bmi} kg/m² (SHAP: ${shapValues.bmi})
    * Huyết áp: ${data.blood_pressure} mmHg (SHAP: ${shapValues.blood_pressure})
    * Cholesterol: ${data.cholesterol_level} mg/dL (SHAP: ${shapValues.cholesterol})
    * Tập thể dục: ${data.exercise_habits === "Low" ? "Ít" : data.exercise_habits === "Medium" ? "Trung bình" : "Nhiều"}
    * Hút thuốc: ${data.smoking === "Yes" ? "Có" : "Không"}
    * Tiền sử gia đình: ${data.family_heart_disease === "Yes" ? "Có" : "Không"}
    * Tiểu đường: ${data.diabetes === "Yes" ? "Có" : "Không"}
    * Thời gian ngủ: ${data.sleep_hours} giờ
    * Mức độ stress: ${data.stress_level === "Yes" ? "Cao" : "Thấp"}
    
    Chỉ số sinh hóa:
    * Triglycerides: ${data.triglyceride_level} mg/dL (SHAP: ${shapValues.triglycerides})
    * Đường huyết lúc đói: ${data.fasting_blood_sugar} mg/dL (SHAP: ${shapValues.blood_sugar})
    * CRP: ${data.crp_level} mg/L (SHAP: ${shapValues.crp})
    * Homocysteine: ${data.homocysteine_level} µmol/L

    Dự đoán: ${prediction === "High Risk" ? "Nguy cơ cao" : "Nguy cơ thấp"}
    Độ tin cậy: ${trustScore.toFixed(1)}%

    Hãy cung cấp phân tích theo cấu trúc sau (bằng Markdown):

    1. Kết quả dự đoán và độ tin cậy
    2. Chi tiết các chỉ số chính và giá trị SHAP:
       * Giải thích ý nghĩa giá trị
       * Ý nghĩa lâm sàng
       * Mức độ ảnh hưởng đến kết quả dự đoán
    3. Đánh giá lối sống:
       * Các yếu tố nguy cơ từ thói quen sinh hoạt
       * Đề xuất thay đổi lối sống
    4. Khuyến nghị:
       * Các biện pháp phòng ngừa
       * Theo dõi và kiểm tra định kỳ

    Hãy đảm bảo:
    * Sử dụng ngôn ngữ dễ hiểu cho người không chuyên
    * Đánh dấu **in đậm** các giá trị quan trọng
    * Trình bày rõ ràng và có cấu trúc
    * Giải thích chi tiết về giá trị SHAP và ý nghĩa của chúng
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}