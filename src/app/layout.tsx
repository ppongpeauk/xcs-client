import { AuthProvider } from "@/context/user";
import "@/styles/globals.css";
export const metadata = {
  title: "EVE XCS",
  description: "EVE XCS",
};

import { Roboto_Flex } from "next/font/google";

const font = Roboto_Flex({
  subsets: ["latin"],
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <html lang="en">
          <body className={font.className}>{children}</body>
        </html>
      </AuthProvider>
    </>
  );
}
