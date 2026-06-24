import "./globals.css";

export const metadata = {
  title: {
    default: "Dian Cahaya Travel - Perjalanan Ibadah Nyaman & Amanah",
    template: "%s | Dian Cahaya Travel"
  },
  description:
    "Wujudkan impian ibadah Umroh dan Haji Anda bersama pembimbing profesional dan fasilitas premium bintang 5 yang terverifikasi resmi oleh Kemenag RI.",
  keywords: ["umroh resmi kemenag", "travel umroh terpercaya", "haji furoda", "haji plus", "dian cahaya travel", "umroh bintang 5", "biro umroh jakarta"],
  authors: [{ name: "Dian Cahaya Travel" }],
  metadataBase: new URL("https://diancahaya.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Dian Cahaya Travel - Perjalanan Ibadah Nyaman & Amanah",
    description: "Wujudkan impian ibadah Umroh dan Haji Anda bersama pembimbing profesional dan fasilitas premium bintang 5.",
    url: "https://diancahaya.com",
    siteName: "Dian Cahaya Travel",
    images: [
      {
        url: "/logo1.png",
        width: 800,
        height: 600,
        alt: "Dian Cahaya Travel Logo",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dian Cahaya Travel",
    description: "Perjalanan Ibadah Umroh & Haji Nyaman, Amanah, dan Berpengalaman.",
    images: ["/logo1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
