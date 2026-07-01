import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoutes = readdirSync(resolve("content/projects"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
  .map((entry) => `/projects/${entry.name.replace(/\.yml$/, "")}`);

const pageRoutes = readdirSync(resolve("content/pages"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
  .map((entry) => entry.name.replace(/\.yml$/, ""))
  .filter((slug) => slug !== "home")
  .map((slug) => `/${slug}`);

export default defineNuxtConfig({
  compatibilityDate: "2025-03-01",
  devtools: { enabled: true },
  vite: {
    server: {
      watch: {
        ignored: ["**/.output/**", "**/.nuxt/**", "**/node_modules/**"]
      }
    }
  },
  generate: {
    routes: ["/", ...pageRoutes, ...projectRoutes]
  },
  experimental: {
    appManifest: false,
    payloadExtraction: true
  },
  app: {
    head: {
      title: "Simplistart",
      meta: [
        {
          name: "description",
          content:
            "Simplistart is Mason Schmidt's digital agency for websites, tools, automation, and custom product builds."
        }
      ],
      script: [
        { src: "https://identity.netlify.com/v1/netlify-identity-widget.js", tagPosition: "head" }
      ]
    }
  },
  css: ["~/assets/css/main.scss"],
  nitro: {
    output: { dir: ".output" },
    prerender: {
      crawlLinks: true
    }
  },
  ssr: true
});
