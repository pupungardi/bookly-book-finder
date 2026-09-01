import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/daftar";

export const Route = createFileRoute("/daftar")({
  head: () => ({
    meta: [
      { title: "Daftar Akun - Bookly" },
      { name: "description", content: "Buat akun Bookly gratis untuk menyimpan bookmark dan riwayat bacaan Anda." },
      { property: "og:title", content: "Daftar Akun - Bookly" },
      { property: "og:description", content: "Buat akun Bookly gratis untuk menyimpan bookmark dan riwayat bacaan Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
