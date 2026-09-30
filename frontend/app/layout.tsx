import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import ThemeProvider from "./Components/ThemeProvider";
import Footer from "./Components/Footer";
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
  title: "Phoneme Learning Lab",
  description: "Interactive phoneme learning games",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--page-bg)] text-[var(--page-text)]">
        <ThemeProvider>
          <Header />
          <Navbar />
          <main className="flex-1 bg-[var(--page-bg)] text-[var(--page-text)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
