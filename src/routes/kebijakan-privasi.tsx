import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/kebijakan-privasi";

export const Route = createFileRoute("/kebijakan-privasi")({
  head: () => ({
    meta: [
      { title: "Kebijakan Privasi - Bookly" },
      { name: "description", content: "Bagaimana Bookly mengumpulkan, menggunakan, dan melindungi data Anda." },
      { property: "og:title", content: "Kebijakan Privasi - Bookly" },
      { property: "og:description", content: "Bagaimana Bookly mengumpulkan, menggunakan, dan melindungi data Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
