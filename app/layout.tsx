import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MainHeader from "../components/MainHeader/MainHeader";
import SearchUser from "../components/SearchUser/SearchUser";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Let Eat Go",
  description: "Let Eat Go",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  return (
    <html lang="en">
      <head>
        {kakaoMapKey && (
          <Script
            strategy="beforeInteractive"
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&libraries=services,clusterer&autoload=false`}
          />
        )}
      </head>
      <body>
        <ReduxProvider>
          <LanguageProvider>
            <MainHeader />
            <div style={{ marginTop: "10vh" }}>{children}</div>
            <SearchUser />
            <LanguageSwitcher />
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
