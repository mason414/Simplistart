import type { PageContent, ProjectEntry, SiteSettings } from "~/types/content";
import { parse } from "yaml";

const pageModules = import.meta.glob("~/content/pages/*.yml", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;
const projectModules = import.meta.glob("~/content/projects/*.yml", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;
const settingsModules = import.meta.glob("~/content/settings/*.yml", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

function normalizePage(page: PageContent): PageContent {
  return {
    ...page,
    hero: {
      media_type: "image",
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

function loadPages(): PageContent[] {
  return Object.values(pageModules).map((raw) => normalizePage(parse(raw) as PageContent));
}

function loadProjects(): ProjectEntry[] {
  return Object.values(projectModules).map((raw) => parse(raw) as ProjectEntry);
}

function loadSettings(): SiteSettings | null {
  const values = Object.values(settingsModules);
  return values.length ? (parse(values[0]) as SiteSettings) : null;
}

export function useSettingsData() {
  return useAsyncData("site-settings", () => Promise.resolve(loadSettings()));
}

export function useProjectsData() {
  return useAsyncData("site-projects", () => Promise.resolve(loadProjects()));
}

export function usePageData(slug: string | Ref<string> | ComputedRef<string>) {
  const slugRef = computed(() => unref(slug));
  return useAsyncData(
    `page:${slugRef.value}`,
    () => {
      const pages = loadPages();
      return Promise.resolve(pages.find((p) => p.slug === slugRef.value) ?? null);
    },
    { watch: [slugRef] }
  );
}

export function useProjectData(slug: string | Ref<string> | ComputedRef<string>) {
  const slugRef = computed(() => unref(slug));
  return useAsyncData(
    `project:${slugRef.value}`,
    () => {
      const projects = loadProjects();
      return Promise.resolve(projects.find((p) => p.slug === slugRef.value) ?? null);
    },
    { watch: [slugRef] }
  );
}
