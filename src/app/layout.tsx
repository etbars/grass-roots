import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/components/auth-provider";
import { RoleOnboarding } from "@/components/role-onboarding";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grassroots.earth"),
  title: "Grass Roots · Learn by doing. Teach by living.",
  description:
    "A three-sided marketplace for hands-on learning at regenerative farms, homesteads, eco-building sites and permaculture projects. Discover teacher residencies and courses rooted in land, craft, and community.",
  openGraph: {
    type: "website",
    siteName: "Grass Roots",
    title: "Grass Roots · Learn by doing. Teach by living.",
    description:
      "Hands-on courses and teaching residencies at regenerative farms, homesteads, and eco-building sites.",
    url: "https://grassroots.earth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grass Roots · Learn by doing. Teach by living.",
    description:
      "Hands-on courses and teaching residencies at regenerative farms, homesteads, and eco-building sites.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-bark">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <RoleOnboarding />
        </AuthProvider>
      </body>
    </html>
  );
}
