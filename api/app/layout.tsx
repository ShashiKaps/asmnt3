import type { Metadata } from "nex";

export const metadata: Metadata = {
  title: "Phoneme Lab API",
  description: "API service for the Phoneme Lab application",
};

// This is an API-only Next.js app (no styled pages), so the root layout is kept
// minimal and does not pull in the unused Tailwind-based globals.css from the
// original create-next-app scaffold.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
