import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import MainHeader from "../components/MainHeader/MainHeader";


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
          <MainHeader />
          <div style={{ marginTop: "10vh" }}>{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
