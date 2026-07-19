import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Best Dentist in Hennur, Bangalore | DentAlchemy",
  description:
    "Visit DentAlchemy, a trusted dental clinic in Hennur for root canal treatment, implants, braces, teeth whitening, kids dentistry and emergency dental care.",
  alternates: {
    canonical: "https://appointment.dentalchemy.in/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "Best Dentist in Hennur, Bangalore | DentAlchemy",
    description: "Comfort-focused dental care in Hennur for root canals, implants, braces, whitening, children and dental emergencies.",
    url: "https://appointment.dentalchemy.in/",
    siteName: "DentAlchemy",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Dentist in Hennur, Bangalore | DentAlchemy",
    description: "Book personalised dental care near Hennur Bagalur Road, Kothanur.",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#eef7ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
