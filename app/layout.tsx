import type { Metadata } from "next";
import { Albert_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Alex Rivera | Portfolio",
  description: "Building Beyond Possible — Personal Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#edf5ff] text-[#0a0f18] font-sans selection:bg-[#0a0f18] selection:text-white">
        {children}
      </body>
    </html>
  );
}
