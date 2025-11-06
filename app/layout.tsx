import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MainHeader from "../components/MainHeader/MainHeader";
import SearchUser from "../components/SearchUser/SearchUser";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";

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
