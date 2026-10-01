import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CODIA Cafetería | Sistema Integral de Gestión & Operaciones",
  description: "Plataforma de gestión integral para cafetería: Empleados, Asistencia Hikvision, Pre-nómina, Inventario, Recetas, POS, Finanzas, OCR Comprobantes y Cliente Consentido.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}
