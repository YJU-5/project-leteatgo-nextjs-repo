import type { Metadata } from "next";
import "./globals.css";
import Home from "./home/page";

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
      <body style={{ backgroundColor: "#121212" }}>
        {children}
        <Home />
      </body>
    </html>
  );
}
