import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import TopNav from "./_components/TopNav";

export const metadata = {
  title: "Goober",
  description: "Goober",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function Navigation() {
  return (
    <nav>
      <Link href="/">
        <a className="text-white">Users</a>
      </Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <TopNav />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
