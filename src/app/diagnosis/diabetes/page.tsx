"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BiomarkerData {
  name: string;
  value: number;
}

const initialFormData = {
  BMI: "23.5",
  AGE: "45",
  Urea: "32",
  Cr: "0.9",
  HbA1c: "5.7",
  Chol: "185",
  TG: "150",
  HDL: "45",
  LDL: "100",
  VLDL: "30",
};

export default function DiabetesPrediction() {
  const [formData, setFormData] = useState(initialFormData);

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
      const response = await fetch("/api/diagnosis/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          BMI: parseFloat(formData.BMI),
          AGE: parseFloat(formData.AGE),
          Urea: parseFloat(formData.Urea),
          Cr: parseFloat(formData.Cr),
          HbA1c: parseFloat(formData.HbA1c),
          Chol: parseFloat(formData.Chol),
          TG: parseFloat(formData.TG),
          HDL: parseFloat(formData.HDL),
          LDL: parseFloat(formData.LDL),
          VLDL: parseFloat(formData.VLDL),
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

  const biomarkerData: BiomarkerData[] = result
    ? [
        { name: "HbA1c", value: parseFloat(formData.HbA1c) },
        { name: "Cholesterol", value: parseFloat(formData.Chol) },
        { name: "Triglycerides", value: parseFloat(formData.TG) },
        { name: "HDL", value: parseFloat(formData.HDL) },
        { name: "LDL", value: parseFloat(formData.LDL) },
      ]
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Đánh Giá Nguy Cơ Tiểu Đường</h1>
      
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
                    value={formData.AGE}
                    onChange={(e) => handleInputChange(e, "AGE")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi">Chỉ số BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={formData.BMI}
                    onChange={(e) => handleInputChange(e, "BMI")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hba1c">HbA1c (%)</Label>
                  <Input
                    id="hba1c"
                    type="number"
                    step="0.1"
                    value={formData.HbA1c}
                    onChange={(e) => handleInputChange(e, "HbA1c")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chol">Cholesterol</Label>
                  <Input
                    id="chol"
                    type="number"
                    value={formData.Chol}
                    onChange={(e) => handleInputChange(e, "Chol")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tg">Triglycerides</Label>
                  <Input
                    id="tg"
                    type="number"
                    value={formData.TG}
                    onChange={(e) => handleInputChange(e, "TG")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hdl">HDL</Label>
                  <Input
                    id="hdl"
                    type="number"
                    value={formData.HDL}
                    onChange={(e) => handleInputChange(e, "HDL")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL</Label>
                  <Input
                    id="ldl"
                    type="number"
                    value={formData.LDL}
                    onChange={(e) => handleInputChange(e, "LDL")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vldl">VLDL</Label>
                  <Input
                    id="vldl"
                    type="number"
                    value={formData.VLDL}
                    onChange={(e) => handleInputChange(e, "VLDL")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urea">Ure</Label>
                  <Input
                    id="urea"
                    type="number"
                    value={formData.Urea}
                    onChange={(e) => handleInputChange(e, "Urea")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cr">Creatinine</Label>
                  <Input
                    id="cr"
                    type="number"
                    step="0.1"
                    value={formData.Cr}
                    onChange={(e) => handleInputChange(e, "Cr")}
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