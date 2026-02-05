import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { FirestoreErrorBanner } from "@/components/FirestoreErrorBanner";

export const metadata: Metadata = {
  title: "Verified — Learn & Get Hired",
  description: "Software engineering assessments and professional profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <FirestoreErrorBanner />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
