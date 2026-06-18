"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}