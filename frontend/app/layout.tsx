import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from "@/components/common/ToastProvider";
import { BookmarkProvider } from "@/lib/hooks";

export const metadata: Metadata = {
  title: "Layer",
  description: "콘텐츠의 모든 결 — 영상과 텍스트가 공존하는 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          <BookmarkProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
              <AppShell>{children}</AppShell>
            </GoogleOAuthProvider>
          </BookmarkProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
