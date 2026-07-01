import type { PageContent, ProjectEntry, SiteSettings } from "~/types/content";

export async function useSettingsData() {
  return useAsyncData<SiteSettings>("site-settings", () =>
    $fetch<SiteSettings>("/api/settings")
  );
}

export async function useProjectsData() {
  return useAsyncData<ProjectEntry[]>("site-projects", () =>
    $fetch<ProjectEntry[]>("/api/projects")
  );
}

export async function usePageData(slug: string | Ref<string> | ComputedRef<string>) {
  const slugRef = computed(() => unref(slug));

  return useAsyncData<PageContent | null>(
    () => `page:${slugRef.value}`,
    () => $fetch<PageContent>(`/api/pages/${slugRef.value}`).catch(() => null),
    { watch: [slugRef] }
  );
}

export async function useProjectData(slug: string | Ref<string> | ComputedRef<string>) {
  const slugRef = computed(() => unref(slug));

  return useAsyncData<ProjectEntry | null>(
    () => `project:${slugRef.value}`,
    () => $fetch<ProjectEntry>(`/api/projects/${slugRef.value}`).catch(() => null),
    { watch: [slugRef] }
  );
}
