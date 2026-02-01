import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overlap - Connect once. Stay in the loop forever.",
  description: "Overlap turns scattered work context into an actionable feed to help you get through work faster and with more clarity.",
};

// Playfair Display as fallback for Perfectly Nineties (similar serif style)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
