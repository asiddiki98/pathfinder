import type { Metadata } from "next";
import "../theme/globals.css";

export const metadata: Metadata = {
  title: "Pathfinder App",
  description: "A visualizer for pathfinding algorithms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
