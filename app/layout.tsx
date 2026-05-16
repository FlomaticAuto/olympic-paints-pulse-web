import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import MobileLayout from "@/components/layouts/MobileLayout";
import DesktopLayout from "@/components/layouts/DesktopLayout";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PULSE — Olympic Paints",
  description: "Live sales performance for the Olympic Paints team.",
  applicationName: "PULSE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PULSE",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#071022",
};

const MOBILE_UA = /mobile|android|iphone|ipad/i;

function isMobileUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  return MOBILE_UA.test(ua);
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const ua = requestHeaders.get("user-agent");
  const isMobile = isMobileUserAgent(ua);

  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}
    >
      <body>
        {isMobile ? (
          <MobileLayout>{children}</MobileLayout>
        ) : (
          <DesktopLayout>{children}</DesktopLayout>
        )}
      </body>
    </html>
  );
}
