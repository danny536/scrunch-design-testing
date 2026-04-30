import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../fonts/Inter-VariableFont.ttf",        style: "normal" },
    { path: "../fonts/Inter-Italic-VariableFont.ttf", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/Newsreader-VariableFont.ttf",        style: "normal" },
    { path: "../fonts/Newsreader-Italic-VariableFont.ttf", style: "italic" },
  ],
  variable: "--font-newsreader-var",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-Regular.ttf",        weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-Italic.ttf",         weight: "400", style: "italic" },
    { path: "../fonts/IBMPlexMono-Medium.ttf",         weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexMono-MediumItalic.ttf",   weight: "500", style: "italic" },
    { path: "../fonts/IBMPlexMono-SemiBold.ttf",       weight: "600", style: "normal" },
    { path: "../fonts/IBMPlexMono-SemiBoldItalic.ttf", weight: "600", style: "italic" },
  ],
  variable: "--font-plex-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrunch Design Testing",
  description: "Scrunch component library and design system reference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
