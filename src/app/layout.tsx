import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import ToasterProvider from "@/components/ToasterProvider";
import { getCategories, getProducts } from "@/lib/api";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

function resolveSiteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

const description =
  "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজারদর — বাজারভিত্তিক তুলনা, গড়, সর্বনিম্ন-সর্বাধিক দাম এবং দামের পরিবর্তন এক জায়গায়।";

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: {
    default: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description,
  applicationName: "BazarDor",
  openGraph: {
    title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    description,
    locale: "bn_BD",
    type: "website",
    siteName: "বাজার দর",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05893e",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The shell (category links + ticker) must never take the whole site down:
  // if the price API is unreachable the pages show their own error states.
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  return (
    <html lang="bn" data-theme="bazardor" className={hindSiliguri.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          মূল অংশে যান
        </a>
        <Navbar categories={categories} />
        <PriceTicker products={products} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <ToasterProvider />
      </body>
    </html>
  );
}
