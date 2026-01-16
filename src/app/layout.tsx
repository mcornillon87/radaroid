import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Radaroid — Le DXOMARK des Robots",
    template: "%s | Radaroid"
  },
  description: "Plateforme de comparaison technique de robots humanoïdes. Découvrez quel robot est capable d'exécuter vos tâches avec notre système de scoring par métier.",
  keywords: ["robot", "humanoïde", "comparaison", "robot serveur", "robot manutention", "robotique", "automatisation"],
  authors: [{ name: "Radaroid" }],
  creator: "Radaroid",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://radaroid.com",
    siteName: "Radaroid",
    title: "Radaroid — Le DXOMARK des Robots",
    description: "Plateforme de comparaison technique de robots humanoïdes. Découvrez quel robot est capable d'exécuter vos tâches.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Radaroid — Le DXOMARK des Robots"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Radaroid — Le DXOMARK des Robots",
    description: "Plateforme de comparaison technique de robots humanoïdes.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  metadataBase: new URL("https://radaroid.com")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
