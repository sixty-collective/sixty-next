import Script from "next/script";
import { Nunito_Sans, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import "../styles/global.css"
import Layout from "../components/layout"

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: "--font-poppins",
  subsets: ['latin'],
})

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
    <html suppressHydrationWarning lang="en" className={`${poppins.variable} ${nunitoSans.variable} ${geistMono.variable} antialiased`}>
      <body
      suppressHydrationWarning
      >
        <Layout>
          <Script src="https://kit.fontawesome.com/224444bc09.js"></Script>
          {children}
        </Layout>
      </body>
    </html>
  );
}
