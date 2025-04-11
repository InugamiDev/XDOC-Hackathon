"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";

interface FormData {
  age: string | null;
  gender: string | null;
  blood_pressure: string | null;
  cholesterol_level: string | null;
  exercise_habits: string | null;
  smoking: string | null;
  family_heart_disease: string | null;
  diabetes: string | null;
  bmi: string | null;
  high_blood_pressure: string | null;
  low_hdl_cholesterol: string | null;
  high_ldl_cholesterol: string | null;
  alcohol_consumption: string | null;
  stress_level: string | null;
  sleep_hours: string | null;
  sugar_consumption: string | null;
  triglyceride_level: string | null;
  fasting_blood_sugar: string | null;
  crp_level: string | null;
  homocysteine_level: string | null;
}

interface ExplanationSection {
  title: string;
  items: Array<{
    label: string;
    value: string;
    shap?: string;
    status?: string;
    impact?: string;
  }>;
}

interface RiskFactor {
  category: string;
  factors: string[];
}

interface ExplanationData {
  patientInfo: ExplanationSection;
  vitals: ExplanationSection;
  lifestyle: ExplanationSection;
  biomarkers: ExplanationSection;
  prediction: {
    title: string;
    risk: string;
    confidence: string;
    interpretation: string;
  };
  analysis: {
    title: string;
    mainFactors: Array<{
      factor: string;
      impact: string;
      explanation: string;
    }>;
    riskFactors: RiskFactor[];
  };
  recommendations: {
    title: string;
    lifestyle: string[];
    monitoring: string[];
    prevention: string[];
  };
}

const initialFormData: FormData = {
  age: null,
  gender: "Male",
  blood_pressure: null,
  cholesterol_level: null,
  exercise_habits: "Low",
  smoking: "No",
  family_heart_disease: "No", 
  diabetes: "No",
  bmi: null,
  high_blood_pressure: "No",
  low_hdl_cholesterol: "No",
  high_ldl_cholesterol: "No",
  alcohol_consumption: "Low",
  stress_level: "No",
  sleep_hours: null,
  sugar_consumption: "Low",
  triglyceride_level: null,
  fasting_blood_sugar: null,
  crp_level: null,
  homocysteine_level: null
};

export default function CardiovascularPrediction() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    prediction: string;
    trustScore: number;
    explanation: ExplanationData;
    apiResult: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const processedData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        blood_pressure: formData.blood_pressure ? parseInt(formData.blood_pressure) : null,
        cholesterol_level: formData.cholesterol_level ? parseInt(formData.cholesterol_level) : null,
        bmi: formData.bmi ? parseFloat(formData.bmi) : null,
        sleep_hours: formData.sleep_hours ? parseInt(formData.sleep_hours) : null,
        triglyceride_level: formData.triglyceride_level ? parseInt(formData.triglyceride_level) : null,
        fasting_blood_sugar: formData.fasting_blood_sugar ? parseInt(formData.fasting_blood_sugar) : null,
        crp_level: formData.crp_level ? parseFloat(formData.crp_level) : null,
        homocysteine_level: formData.homocysteine_level ? parseFloat(formData.homocysteine_level) : null,
      };

      const response = await fetch("/api/diagnosis/predict/cardiovascular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();

      if ('error' in data) {
        setError(typeof data.error === 'string' ? data.error : 'Lỗi không xác định');
        setResult(null);
      } else if (!data.explanation || !data.prediction) {
        setError("Lỗi khi xử lý kết quả phân tích");
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi yêu cầu");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormData
  ) => {
    const value = e.target.value === "" ? null : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const renderMetricCard = (section: ExplanationSection) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {section.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{item.label}:</span>
              <div className="text-right">
                <span className={`${
                  item.status === 'high' ? 'text-red-500' :
                  item.status === 'low' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {item.value}
                </span>
                <div className="text-sm">
                  {item.impact && (
                    <span className={`${
                      item.impact === 'high' ? 'text-red-500' :
                      item.impact === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      Mức độ: {
                        item.impact === 'high' ? 'Cao' :
                        item.impact === 'medium' ? 'Trung bình' :
                        'Thấp'
                      }
                    </span>
                  )}
                </div>
                {item.shap && (
                  <div className="text-sm text-gray-500">
                    SHAP: {item.shap}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRiskFactors = (riskFactors: RiskFactor[]) => (
    <div className="space-y-4">
      {riskFactors.map((category, index) => (
        <div key={index}>
          <h4 className="font-medium mb-2">{category.category}</h4>
          <ul className="list-disc list-inside space-y-1">
            {category.factors.map((factor, fIndex) => (
              <li key={fIndex} className="text-sm text-gray-600">{factor}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderRecommendations = (recommendations: ExplanationData['recommendations']) => (
    <Card>
      <CardHeader>
        <CardTitle>{recommendations.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Lối sống</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.lifestyle.map((item, index) => (
                <li key={index} className="text-sm text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Theo dõi</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.monitoring.map((item, index) => (
                <li key={index} className="text-sm text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Phòng ngừa</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.prevention.map((item, index) => (
                <li key={index} className="text-sm text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Đánh Giá Nguy Cơ Tim Mạch</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Bệnh Nhân</CardTitle>
            <CardDescription>Nhập các chỉ số sức khỏe của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Tuổi</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age ?? ""}
                    onChange={(e) => handleInputChange(e, "age")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select
                    id="gender"
                    className="w-full p-2 border rounded"
                    value={formData.gender ?? "Male"}
                    onChange={(e) => handleInputChange(e, "gender")}
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_pressure">Huyết áp</Label>
                  <Input
                    id="blood_pressure"
                    type="number"
                    value={formData.blood_pressure ?? ""}
                    onChange={(e) => handleInputChange(e, "blood_pressure")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cholesterol_level">Cholesterol</Label>
                  <Input
                    id="cholesterol_level"
                    type="number"
                    value={formData.cholesterol_level ?? ""}
                    onChange={(e) => handleInputChange(e, "cholesterol_level")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi">Chỉ số BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={formData.bmi ?? ""}
                    onChange={(e) => handleInputChange(e, "bmi")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise_habits">Tập thể dục</Label>
                  <select
                    id="exercise_habits"
                    className="w-full p-2 border rounded"
                    value={formData.exercise_habits ?? "Low"}
                    onChange={(e) => handleInputChange(e, "exercise_habits")}
                  >
                    <option value="Low">Ít</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Nhiều</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smoking">Hút thuốc</Label>
                  <select
                    id="smoking"
                    className="w-full p-2 border rounded"
                    value={formData.smoking ?? "No"}
                    onChange={(e) => handleInputChange(e, "smoking")}
                  >
                    <option value="No">Không</option>
                    <option value="Yes">Có</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family_heart_disease">Tiền sử tim mạch gia đình</Label>
                  <select
                    id="family_heart_disease"
                    className="w-full p-2 border rounded"
                    value={formData.family_heart_disease ?? "No"}
                    onChange={(e) => handleInputChange(e, "family_heart_disease")}
                  >
                    <option value="No">Không</option>
                    <option value="Yes">Có</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diabetes">Tiểu đường</Label>
                  <select
                    id="diabetes"
                    className="w-full p-2 border rounded"
                    value={formData.diabetes ?? "No"}
                    onChange={(e) => handleInputChange(e, "diabetes")}
                  >
                    <option value="No">Không</option>
                    <option value="Yes">Có</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleep_hours">Số giờ ngủ</Label>
                  <Input
                    id="sleep_hours"
                    type="number"
                    value={formData.sleep_hours ?? ""}
                    onChange={(e) => handleInputChange(e, "sleep_hours")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stress_level">Mức độ stress</Label>
                  <select
                    id="stress_level"
                    className="w-full p-2 border rounded"
                    value={formData.stress_level ?? "No"}
                    onChange={(e) => handleInputChange(e, "stress_level")}
                  >
                    <option value="No">Thấp</option>
                    <option value="Yes">Cao</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sugar_consumption">Tiêu thụ đường</Label>
                  <select
                    id="sugar_consumption"
                    className="w-full p-2 border rounded"
                    value={formData.sugar_consumption ?? "Low"}
                    onChange={(e) => handleInputChange(e, "sugar_consumption")}
                  >
                    <option value="Low">Ít</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Nhiều</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alcohol_consumption">Tiêu thụ rượu bia</Label>
                  <select
                    id="alcohol_consumption"
                    className="w-full p-2 border rounded"
                    value={formData.alcohol_consumption ?? "Low"}
                    onChange={(e) => handleInputChange(e, "alcohol_consumption")}
                  >
                    <option value="Low">Ít</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Nhiều</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="triglyceride_level">Triglycerides</Label>
                  <Input
                    id="triglyceride_level"
                    type="number"
                    value={formData.triglyceride_level ?? ""}
                    onChange={(e) => handleInputChange(e, "triglyceride_level")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fasting_blood_sugar">Đường huyết lúc đói</Label>
                  <Input
                    id="fasting_blood_sugar"
                    type="number"
                    value={formData.fasting_blood_sugar ?? ""}
                    onChange={(e) => handleInputChange(e, "fasting_blood_sugar")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp_level">CRP</Label>
                  <Input
                    id="crp_level"
                    type="number"
                    step="0.1"
                    value={formData.crp_level ?? ""}
                    onChange={(e) => handleInputChange(e, "crp_level")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homocysteine_level">Homocysteine</Label>
                  <Input
                    id="homocysteine_level"
                    type="number"
                    step="0.1"
                    value={formData.homocysteine_level ?? ""}
                    onChange={(e) => handleInputChange(e, "homocysteine_level")}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang phân tích..." : "Phân Tích Nguy Cơ"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && typeof error === 'string' && (
          <Card>
            <CardHeader>
              <CardTitle>Lỗi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && result.explanation && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{result.explanation.prediction.title}</CardTitle>
                <CardDescription>
                  Mức độ nguy cơ:{" "}
                  <span className={result.explanation.prediction.risk === "high" ? "text-red-500" : "text-green-500"}>
                    {result.explanation.prediction.risk === "high" ? "Nguy Cơ Cao" : "Nguy Cơ Thấp"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.trustScore && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Độ Tin Cậy</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-blue-500"
                        style={{ width: `${result.trustScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {result.trustScore.toFixed(1)}% độ tin cậy
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-700">
                  {result.explanation.prediction.interpretation}
                </p>
              </CardContent>
            </Card>

            {result.explanation.vitals && renderMetricCard(result.explanation.vitals)}
            {result.explanation.biomarkers && renderMetricCard(result.explanation.biomarkers)}
            
            {result.explanation.analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>{result.explanation.analysis.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.explanation.analysis.mainFactors.map((factor, index) => (
                      <div key={index} className="border-b pb-2 last:border-0">
                        <h4 className="font-medium">{factor.factor}</h4>
                        <p className="text-sm text-gray-600">{factor.explanation}</p>
                        <span className={`text-sm ${
                          factor.impact === 'high' ? 'text-red-500' :
                          factor.impact === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`}>
                          Mức độ ảnh hưởng: {
                            factor.impact === 'high' ? 'Cao' :
                            factor.impact === 'medium' ? 'Trung bình' :
                            'Thấp'
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.explanation.analysis && result.explanation.analysis.riskFactors && (
              <Card>
                <CardHeader>
                  <CardTitle>Yếu tố nguy cơ</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderRiskFactors(result.explanation.analysis.riskFactors)}
                </CardContent>
              </Card>
            )}

            {result.explanation.recommendations && renderRecommendations(result.explanation.recommendations)}
          </div>
        )}
      </div>
    </div>
  );
}