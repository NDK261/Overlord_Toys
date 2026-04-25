import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OVERLORD TOYS | Premium Collector Artifacts",
  description: "Premium figures, building sets & limited edition collectibles engineered for the modern curator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800&family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
