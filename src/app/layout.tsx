import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import BootstrapClient from "@/components/BootstrapClient";
import AnimationProvider from "@/components/AnimationProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <BootstrapClient />
        <AnimationProvider />

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}