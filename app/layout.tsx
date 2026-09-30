import type { Metadata } from "next";
import {
  Albert_Sans,
  Fragment_Mono,
  Syne,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
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

// Fonts required by the `me 4` page (PAGE 2)
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Harshavardhan J | AWS Cloud × DevOps",
  description:
    "Fresher portfolio of Harshavardhan J — B.Sc. Computer Technology graduate from Coimbatore, building practical skills in AWS Cloud and DevOps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${fragmentMono.variable} ${syne.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="hv-bg-canvas h-full text-[#0a0f18] font-sans selection:bg-[#0a0f18] selection:text-white">
        {children}
      </body>
    </html>
  );
}
