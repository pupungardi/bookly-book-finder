import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk - Bookly" },
      { name: "description", content: "Masuk ke akun Bookly Anda untuk melanjutkan membaca." },
      { property: "og:title", content: "Masuk - Bookly" },
      { property: "og:description", content: "Masuk ke akun Bookly Anda untuk melanjutkan membaca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
