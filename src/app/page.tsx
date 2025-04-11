import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Health Risk Assessment Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/diagnosis/diabetes" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>Diabetes Risk Assessment</CardTitle>
                <CardDescription>
                  Evaluate your risk of diabetes using advanced biomarkers and AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Analyzes factors including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                  <li>HbA1c levels</li>
                  <li>Blood sugar markers</li>
                  <li>Cholesterol profile</li>
                  <li>BMI and age factors</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/diagnosis/cardiovascular" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>Cardiovascular Risk Assessment</CardTitle>
                <CardDescription>
                  Evaluate your cardiovascular health using comprehensive health indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Analyzes factors including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                  <li>Blood pressure</li>
                  <li>Lifestyle factors</li>
                  <li>Family history</li>
                  <li>Key biomarkers</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p className="mt-2">
            Disclaimer: This tool is for informational purposes only and should not replace professional medical advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
