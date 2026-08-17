import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar4 } from "@/components/navbar4";
import { Footer18 } from "@/components/footer18";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DIAL — Design Inclusion and Access Lab",
    template: "%s | DIAL",
  },
  description:
    "Human-computer interaction research from the Design Inclusion and Access Lab at North South University, Dhaka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar4 className="sticky" />
        <main className="flex-1">{children}</main>
        <Footer18 />
      </body>
    </html>
  );
}
