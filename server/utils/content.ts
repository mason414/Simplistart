import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import type {
  PageContent,
  ProjectEntry,
  SiteSettings
} from "~/types/content";

const contentRoot = resolve(process.cwd(), "content");
async function readYamlFile<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(resolve(contentRoot, relativePath), "utf8");
  return parse(raw) as T;
}

async function readCollection<T>(relativeDir: string): Promise<T[]> {
  const dir = resolve(contentRoot, relativeDir);
  const entries = await fs.readdir(dir);
  const files = entries.filter((entry) => entry.endsWith(".yml")).sort();
  return Promise.all(files.map((file) => readYamlFile<T>(`${relativeDir}/${file}`)));
}

function normalizePage(page: PageContent): PageContent {
  return {
    ...page,
    hero: {
      media_type: page.hero?.media_type ?? "image",
      image: page.hero?.image,
      video: page.hero?.video,
      eyebrow: page.hero?.eyebrow,
      headline: page.hero?.headline ?? page.title,
      subhead: page.hero?.subhead,
      video_cta_label: page.hero?.video_cta_label,
      video_embed_url: page.hero?.video_embed_url,
      video_auto_open: page.hero?.video_auto_open ?? false,
      hide_copy: page.hero?.hide_copy ?? false,
      primary_action: page.hero?.primary_action,
      secondary_action: page.hero?.secondary_action
    },
    sections: Array.isArray(page.sections) ? page.sections : []
  };
}

export async function getSettings() {
  return readYamlFile<SiteSettings>("settings/site.yml");
}

export async function getPageBySlug(slug: string) {
  const pages = await getPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getPages() {
  const pages = await readCollection<PageContent>("pages");
  return pages.map(normalizePage);
}

export async function getProjects() {
  const projects = await readCollection<ProjectEntry>("projects");
  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
