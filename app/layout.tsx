// File: app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
// --- MODIFICATION: Import the font with its original name ---
import { Source_Sans_3 } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GlobalAudioPlayer } from "@/components/global-audio-player"
import { Footer } from "@/components/footer"
import { MuteButton } from "@/components/mute-button"
import prisma from "@/lib/prisma"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "700", "900"],
})

// --- MODIFICATION: Use the original name for the font variable ---
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-3", // MODIFICATION: Update the CSS variable name
  weight: ["400", "600", "700"],
})

export async function generateMetadata(): Promise<Metadata> {
  const contentBlocks = await prisma.contentBlock.findMany({
    where: { key: { in: ['seo_title', 'seo_description'] } }
  });
  const content = Object.fromEntries(contentBlocks.map(b => [b.key, b.value]));
  
  return {
    title: content.seo_title || "Fiz - Freestyle & Beats",
    description: content.seo_description || "Pittsburgh's finest freestyle rapper and beat maker. Real music for the world.",
    generator: "v0.app",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await prisma.siteSettings.findFirst();
  const backgroundImageUrl = settings?.backgroundImageUrl;

  const bodyStyle: React.CSSProperties = backgroundImageUrl ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } : {};

  return (
    <html
      lang="en"
      // --- MODIFICATION: Use the new variable name in the className ---
      className={cn(playfairDisplay.variable, sourceSans3.variable, "antialiased")}
      suppressHydrationWarning
    >
      <body className="font-sans" style={bodyStyle}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false} 
          disableTransitionOnChange
        >
          <GlobalAudioPlayer />
          
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>

          <MuteButton />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}