import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin - Bookly" },
      { name: "description", content: "Kelola katalog ebook Bookly: unggah, edit, dan hapus buku." },
      { property: "og:title", content: "Panel Admin - Bookly" },
      { property: "og:description", content: "Kelola katalog ebook Bookly: unggah, edit, dan hapus buku." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
