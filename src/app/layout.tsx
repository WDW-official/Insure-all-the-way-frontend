import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContextProvider } from "@/context/ToastContext";
import UseSWRConfigProvider from "@/config/SWRConfig";
import AuthContextProvider from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatBotContainer from "@/container/ChatBotContainer/ChatBotContainer";
import { ChatContextProvider } from "@/context/ChatbotContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insure All The Way",
  description: "Insurance With A Difference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          src="https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UseSWRConfigProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string}
          >
            <ToastContextProvider>
              <AuthContextProvider>
                <ChatContextProvider>{children}</ChatContextProvider>
              </AuthContextProvider>
            </ToastContextProvider>
          </GoogleOAuthProvider>
        </UseSWRConfigProvider>
      </body>
    </html>
  );
}
