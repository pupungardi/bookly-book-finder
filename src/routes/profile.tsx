import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil - Bookly" },
      { name: "description", content: "Lihat dan ubah informasi profil pembaca Bookly Anda." },
      { property: "og:title", content: "Profil - Bookly" },
      { property: "og:description", content: "Lihat dan ubah informasi profil pembaca Bookly Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
