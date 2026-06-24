import "./globals.css";

export const metadata = {
  title: "Dian Cahaya Travel - Perjalanan Ibadah Nyaman & Amanah",
  description:
    "Wujudkan impian ibadah Umroh dan Haji Anda bersama pembimbing profesional dan fasilitas premium bintang 5 yang terverifikasi resmi oleh Kemenag.",
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
