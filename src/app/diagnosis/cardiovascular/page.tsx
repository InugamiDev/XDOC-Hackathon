"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormData {
  age: string;
  gender: string;
  blood_pressure: string;
  cholesterol_level: string;
  exercise_habits: string;
  smoking: string;
  family_heart_disease: string;
  diabetes: string;
  bmi: string;
  high_blood_pressure: string;
  low_hdl_cholesterol: string;
  high_ldl_cholesterol: string;
  alcohol_consumption: string;
  stress_level: string;
  sleep_hours: string;
  sugar_consumption: string;
  triglyceride_level: string;
  fasting_blood_sugar: string;
  crp_level: string;
  homocysteine_level: string;
}

const initialFormData: FormData = {
  age: "",
  gender: "Male",
  blood_pressure: "",
  cholesterol_level: "",
  exercise_habits: "Low",
  smoking: "No",
  family_heart_disease: "No", 
  diabetes: "No",
  bmi: "",
  high_blood_pressure: "No",
  low_hdl_cholesterol: "No",
  high_ldl_cholesterol: "No",
  alcohol_consumption: "Low",
  stress_level: "No",
  sleep_hours: "",
  sugar_consumption: "Low",
  triglyceride_level: "",
  fasting_blood_sugar: "",
  crp_level: "",
  homocysteine_level: ""
};

export default function CardiovascularPrediction() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [result, setResult] = useState<{
    prediction: string;
    trustScore?: number;
    explanation: string;
    apiResult: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/diagnosis/predict/cardiovascular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          blood_pressure: parseInt(formData.blood_pressure),
          cholesterol_level: parseInt(formData.cholesterol_level),
          bmi: parseFloat(formData.bmi),
          sleep_hours: parseInt(formData.sleep_hours),
          triglyceride_level: parseInt(formData.triglyceride_level),
          fasting_blood_sugar: parseInt(formData.fasting_blood_sugar),
          crp_level: parseFloat(formData.crp_level),
          homocysteine_level: parseFloat(formData.homocysteine_level),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const biomarkerData = result
    ? [
        { name: "Huyết áp", value: parseInt(formData.blood_pressure) },
        { name: "Cholesterol", value: parseInt(formData.cholesterol_level) },
        { name: "Triglycerides", value: parseInt(formData.triglyceride_level) },
        { name: "Đường huyết", value: parseInt(formData.fasting_blood_sugar) },
        { name: "CRP", value: parseFloat(formData.crp_level) },
      ]
    : [];

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
                    value={formData.age}
                    onChange={(e) => handleInputChange(e, "age")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select
                    id="gender"
                    className="w-full p-2 border rounded"
                    value={formData.gender}
                    onChange={(e) => handleInputChange(e, "gender")}
                    required
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
                    value={formData.blood_pressure}
                    onChange={(e) => handleInputChange(e, "blood_pressure")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cholesterol_level">Cholesterol</Label>
                  <Input
                    id="cholesterol_level"
                    type="number"
                    value={formData.cholesterol_level}
                    onChange={(e) => handleInputChange(e, "cholesterol_level")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi">Chỉ số BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange(e, "bmi")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise_habits">Tập thể dục</Label>
                  <select
                    id="exercise_habits"
                    className="w-full p-2 border rounded"
                    value={formData.exercise_habits}
                    onChange={(e) => handleInputChange(e, "exercise_habits")}
                    required
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
                    value={formData.smoking}
                    onChange={(e) => handleInputChange(e, "smoking")}
                    required
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
                    value={formData.family_heart_disease}
                    onChange={(e) => handleInputChange(e, "family_heart_disease")}
                    required
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
                    value={formData.diabetes}
                    onChange={(e) => handleInputChange(e, "diabetes")}
                    required
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
                    value={formData.sleep_hours}
                    onChange={(e) => handleInputChange(e, "sleep_hours")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stress_level">Mức độ stress</Label>
                  <select
                    id="stress_level"
                    className="w-full p-2 border rounded"
                    value={formData.stress_level}
                    onChange={(e) => handleInputChange(e, "stress_level")}
                    required
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
                    value={formData.sugar_consumption}
                    onChange={(e) => handleInputChange(e, "sugar_consumption")}
                    required
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
                    value={formData.alcohol_consumption}
                    onChange={(e) => handleInputChange(e, "alcohol_consumption")}
                    required
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
                    value={formData.triglyceride_level}
                    onChange={(e) => handleInputChange(e, "triglyceride_level")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fasting_blood_sugar">Đường huyết lúc đói</Label>
                  <Input
                    id="fasting_blood_sugar"
                    type="number"
                    value={formData.fasting_blood_sugar}
                    onChange={(e) => handleInputChange(e, "fasting_blood_sugar")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp_level">CRP</Label>
                  <Input
                    id="crp_level"
                    type="number"
                    step="0.1"
                    value={formData.crp_level}
                    onChange={(e) => handleInputChange(e, "crp_level")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homocysteine_level">Homocysteine</Label>
                  <Input
                    id="homocysteine_level"
                    type="number"
                    step="0.1"
                    value={formData.homocysteine_level}
                    onChange={(e) => handleInputChange(e, "homocysteine_level")}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang phân tích..." : "Phân Tích Nguy Cơ"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Kết Quả Đánh Giá</CardTitle>
              <CardDescription>
                Mức độ nguy cơ:{" "}
                <span className={result.prediction === "High Risk" ? "text-red-500" : "text-green-500"}>
                  {result.prediction === "High Risk" ? "Nguy Cơ Cao" : "Nguy Cơ Thấp"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.trustScore !== undefined && (
                <div>
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

              <div>
                <h3 className="font-semibold mb-2">Chỉ Số Quan Trọng</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={biomarkerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Phân Tích Chi Tiết</h3>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.explanation}
                  </ReactMarkdown>
                </div>
              </div>

              {/* {result.apiResult && (
                <div>
                  <h3 className="font-semibold mb-2">Kết Quả API</h3>
                  <p className="text-sm text-gray-700">{result.apiResult}</p>
                </div>
              )} */}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}