<script setup lang="ts">
const { data: page } = await usePageData("home");
const { data: projects } = await useProjectsData();

useHead(() => ({
  title: page.value?.hero.headline ? `${page.value.hero.headline} | Simplistart` : "Simplistart"
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
      home-hero
    />

    <PageSections :page="page" :projects="projects" />
  </div>
</template>
