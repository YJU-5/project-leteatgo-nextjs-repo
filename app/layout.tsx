import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import MainHeader from "../components/MainHeader/MainHeader";
import SearchUser from "../components/SearchUser/SearchUser";
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
  return (
    <html lang="en">
      <head>
        <Script
          strategy="beforeInteractive"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`}
        />
      </head>
      <body>
        <ReduxProvider>
          <MainHeader />
          <div style={{ marginTop: "10vh" }}>{children}</div>
          <SearchUser />
        </ReduxProvider>
      </body>
    </html>
  );
}
