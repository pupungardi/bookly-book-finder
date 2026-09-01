import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/transaksi";

export const Route = createFileRoute("/transaksi")({
  head: () => ({
    meta: [
      { title: "Transaksi - Bookly" },
      { name: "description", content: "Riwayat pembelian dan peminjaman buku di Bookly." },
      { property: "og:title", content: "Transaksi - Bookly" },
      { property: "og:description", content: "Riwayat pembelian dan peminjaman buku di Bookly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
