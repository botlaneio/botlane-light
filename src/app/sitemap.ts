import type { MetadataRoute } from "next";

const baseUrl = "https://botlane.io";

const routes = [
  "",
  "/about",
  "/how-it-works",
  "/metrics",
  "/pricing",
  "/case-studies",
  "/faq",
  "/book-call",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
