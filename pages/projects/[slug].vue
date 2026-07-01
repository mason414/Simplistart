<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));
const { data: project } = await useProjectData(slug);

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

useHead(() => ({
  title: project.value ? `${project.value.title} | Simplistart` : "Simplistart"
}));
</script>

<template>
  <div v-if="project" class="page-shell">
    <HeroSection
      :image="project.hero_image"
      media-type="image"
      :eyebrow="project.category"
      :headline="project.title"
      :subhead="project.summary"
      compact
      full-bleed
    />

    <section class="section two-column">
      <div>
        <p class="eyebrow">Case Study</p>
        <h2>{{ project.title }}</h2>
      </div>
      <div class="section-copy">
        <p>{{ project.description || project.summary }}</p>
        <p v-if="project.outcome">{{ project.outcome }}</p>
        <div v-if="project.services?.length" class="home-locations__items">
          <span v-for="service in project.services" :key="service">{{ service }}</span>
        </div>
        <p v-if="project.external_url" class="project-cta">
          <a :href="project.external_url" target="_blank" rel="noreferrer" class="button-link">Visit Live Project &nearr;</a>
        </p>
      </div>
    </section>


  </div>
</template>
