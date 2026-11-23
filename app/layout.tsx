import type { Metadata } from "next";
import { Inter, Sofia_Sans_Extra_Condensed } from "next/font/google";
import "./globals.css";

const display = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
});

const text = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Steven Lai — Operations Automation & VR Developer",
  description:
    "Steven Lai builds retail operations automation and Unity VR experiences in Hong Kong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('rv-ready')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
