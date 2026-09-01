import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bookly - Perpustakaan Digital Pribadi" },
      { name: "description", content: "Jelajahi katalog ebook, tandai favorit, unduh untuk dibaca offline, dan lanjutkan bacaan Anda di Bookly." },
      { property: "og:title", content: "Bookly - Perpustakaan Digital Pribadi" },
      { property: "og:description", content: "Jelajahi katalog ebook, tandai favorit, unduh untuk dibaca offline, dan lanjutkan bacaan Anda di Bookly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
