import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/live-chat";

export const Route = createFileRoute("/live-chat")({
  head: () => ({
    meta: [
      { title: "Live Chat - Bookly" },
      { name: "description", content: "Hubungi dukungan Bookly melalui live chat." },
      { property: "og:title", content: "Live Chat - Bookly" },
      { property: "og:description", content: "Hubungi dukungan Bookly melalui live chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
