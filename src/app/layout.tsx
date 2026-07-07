import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "../fonts/Unbounded-Variable.ttf",
  variable: "--font-display-raw",
  weight: "200 900",
  display: "swap",
});

const body = localFont({
  src: "../fonts/Manrope-Variable.ttf",
  variable: "--font-body-raw",
  weight: "200 800",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "../fonts/SpaceMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SpaceMono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-mono-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CubeOcean — Coming Soon",
  description:
    "CubeOcean Games server website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
