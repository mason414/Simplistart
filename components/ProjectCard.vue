<script setup lang="ts">
import type { ProjectEntry } from "~/types/content";

defineProps<{
  project: ProjectEntry;
  featured?: boolean;
  index?: number;
}>();
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="project-card" :class="{ 'project-card--featured': featured }">
    <div class="project-card__media">
      <img v-if="project.thumbnail" :src="project.thumbnail" :alt="project.title" class="project-card__image" />
      <div v-else class="project-card__fallback">
        <span>{{ project.category }}</span>
      </div>
      <div class="project-card__overlay">
        <span>View Case Study</span>
      </div>
    </div>
    <div class="project-card__body">
      <p class="eyebrow">{{ project.category }}</p>
      <h3>{{ project.title }}</h3>
      <p>{{ project.summary || "Explore the strategy, build, and outcome." }}</p>
    </div>
  </NuxtLink>
</template>
