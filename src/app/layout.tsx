import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Health Risk Assessment",
  description: "Evaluate your health risks using AI-powered analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                XDOC
              </Link>
              <div className="space-x-6">
                <Link
                  href="/diagnosis/diabetes"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Đánh Giá Nguy Cơ Tiểu Đường
                </Link>
                <Link
                  href="/diagnosis/cardiovascular"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Đánh Giá Nguy Cơ Tim Mạch
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
