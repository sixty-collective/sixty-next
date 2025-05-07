import Script from "next/script";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/global.css"
import Layout from "../components/layout"

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
      suppressHydrationWarning
        className={`${nunitoSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>
          <Script src="https://kit.fontawesome.com/224444bc09.js"></Script>
          {children}
        </Layout>
      </body>
    </html>
  );
}
