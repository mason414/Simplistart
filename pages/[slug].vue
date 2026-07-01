<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));

const { data: page } = await usePageData(slug);
const { data: projects } = await useProjectsData();
const { data: settings } = await useSettingsData();

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useHead(() => ({
  title: page.value ? `${page.value.title} | Simplistart` : "Simplistart"
}));
</script>

<template>
  <div v-if="page" class="page-shell">
    <HeroSection
      :image="page.hero.image"
      :eyebrow="page.hero.eyebrow"
      :headline="page.hero.headline"
      :subhead="page.hero.subhead"
      :primary-action="page.hero.primary_action"
      :secondary-action="page.hero.secondary_action"
      compact
    />

    <PageSections :page="page" :projects="projects" :settings="settings" />
  </div>
</template>
