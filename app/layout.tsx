import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientOnly from "@/components/ClientOnly";

const instrumentalSans = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Venspace — Find Creative Spaces Near You",
  description:
    "Explore unique creative spaces in Lagos with Venspace. Book studios, workspaces, and art venues for your next project or event. Flexible options for creators, entrepreneurs, and innovators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <ClientOnly>
      <head>
        {/* Google Tag Manager */}
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KZNJ3MVR')`}</script>
      </head>
      <body className={`${instrumentalSans.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KZNJ3MVR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Toaster position="top-center" richColors />
        {children}
      </body>
      </ClientOnly>
    </html>
  );
}
