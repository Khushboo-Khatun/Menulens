import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
import { MobileContainer } from "@/components/common/MobileContainer";
import { BottomNav } from "@/components/common/BottomNav";
import { InstallPrompt } from "@/components/common/InstallPrompt";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MenuLens — Smart Health-First Menu Scanner",
  description:
    "Mobile-first PWA for health-conscious dining in India. Scan menus, get personalized health scores, macros, and customized waiter instructions.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MenuLens",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1F8A4C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased selection:bg-brand-500/20 selection:text-brand-700">
        <ThemeProvider>
          <MobileContainer>
            {children}
            <InstallPrompt />
            <BottomNav />
          </MobileContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
