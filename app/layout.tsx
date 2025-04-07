import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";


const instrumentalSans = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Venspace",
  description: "Venspace | Vacation rentals, cabins, beach houses & more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentalSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
