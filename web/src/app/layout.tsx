
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: "Connect & Thrive | Friendship • Activities • Belonging",
    template: "%s | Connect & Thrive",
  },

  description:
    "Connect & Thrive is a faith-centered community for young adults ages 20–35. Discover wholesome activities, build meaningful friendships, and find a place to belong.",

  applicationName: "Connect & Thrive",

  keywords: [
    "Connect and Thrive",
    "young adult community",
    "friendship",
    "activities",
    "belonging",
    "faith-centered community",
    "service opportunities",
    "social activities",
  ],

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

