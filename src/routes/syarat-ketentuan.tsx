import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/syarat-ketentuan";

export const Route = createFileRoute("/syarat-ketentuan")({
  head: () => ({
    meta: [
      { title: "Syarat & Ketentuan - Bookly" },
      { name: "description", content: "Ketentuan penggunaan layanan Bookly." },
      { property: "og:title", content: "Syarat & Ketentuan - Bookly" },
      { property: "og:description", content: "Ketentuan penggunaan layanan Bookly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
