import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CartContextProvider } from "@/context/CartContext";
import { CurrencyContextProvider } from "@/context/CurrencyContext";
import FloatingNavButtons from "@/components/common/FloatingNavButtons";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/constants";
import "./globals.css";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const accentFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400", "500", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${BRAND_NAME} | Pure Natural Perfume, Attar & Deodorants`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Assam-based pure natural essence brand offering perfume, attar, and deodorants crafted with clean ingredients.",
  keywords: [
    "assam perfume",
    "natural attar",
    "natural deodorant",
    "pure natural essence",
    "dnortheasternessence",
    "attar",
  ],
  openGraph: {
    title: `${BRAND_NAME} | Pure Natural Perfume, Attar & Deodorants`,
    description: BRAND_DESCRIPTION,
    type: "website",
    url: appUrl,
    siteName: BRAND_NAME,
    images: [
      {
        url: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: `${BRAND_NAME} pure natural fragrance collection`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Pure Natural Perfume, Attar & Deodorants`,
    description: BRAND_DESCRIPTION,
    images: [
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} ${accentFont.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider>
            <CurrencyContextProvider>
              <CartContextProvider>
                {children}
                <FloatingNavButtons />
              </CartContextProvider>
            </CurrencyContextProvider>
          </ThemeProvider>
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  );
}
