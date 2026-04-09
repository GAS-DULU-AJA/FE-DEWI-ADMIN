import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mitra Dewi — Platform Digital Desa Wisata",
  description:
    "Platform digital terpadu untuk mitra desa wisata Indonesia. Kelola penginapan, UMKM, acara, dan lebih banyak lagi.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
