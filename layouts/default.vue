<script setup lang="ts">
import type { SiteSettings } from "~/types/content";

const { data: settings } = await useSettingsData();

const route = useRoute();
const isHome = computed(() => route.path === "/");

useHead(() => {
  const favicon = settings.value?.favicon;

  if (!favicon) {
    return {};
  }

  const iconType = favicon.endsWith(".svg") ? "image/svg+xml" : "image/png";

  return {
    link: [
      { rel: "icon", type: iconType, href: favicon },
      { rel: "shortcut icon", type: iconType, href: favicon },
      { rel: "apple-touch-icon", href: favicon }
    ]
  };
});
</script>

<template>
  <div class="site-shell">
    <SiteHeader v-if="settings" :settings="settings" :home="isHome" />
    <main>
      <slot />
    </main>
    <SiteFooter v-if="settings" :settings="settings" />
  </div>
</template>
