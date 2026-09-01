import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/akun";

export const Route = createFileRoute("/akun")({
  head: () => ({
    meta: [
      { title: "Akun Saya - Bookly" },
      { name: "description", content: "Kelola akun, preferensi bacaan, dan data Bookly Anda." },
      { property: "og:title", content: "Akun Saya - Bookly" },
      { property: "og:description", content: "Kelola akun, preferensi bacaan, dan data Bookly Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
