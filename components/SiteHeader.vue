<script setup lang="ts">
import type { SiteSettings } from "~/types/content";

const props = defineProps<{
  settings: SiteSettings;
  home?: boolean;
}>();

const route = useRoute();
const menuOpen = ref(false);

const isHome = computed(() => props.home ?? route.path === "/");
const primaryNavItems = computed(() => props.settings.nav_items.filter((item) => item.variant !== "button"));
const actionItems = computed(() => props.settings.nav_items.filter((item) => item.variant === "button"));

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  }
);
</script>

<template>
  <header class="site-header" :class="{ 'site-header--home': isHome }">
    <div class="site-header__inner">
      <div class="site-header__utility">
        <div class="site-header__utility-copy">
          <span>{{ settings.site_tagline || "Digital Agency" }}</span>
          <span>{{ settings.phone }}</span>
          <span>{{ settings.email }}</span>
        </div>
      </div>

      <div class="site-header__main">
        <div class="site-header__left">
          <NuxtLink to="/" class="brand">
            <img v-if="settings.brand_logo" :src="settings.brand_logo" :alt="settings.site_title" class="brand-logo" />
            <span v-if="settings.brand_logo" class="brand-name">{{ settings.site_title }}</span>
            <div v-else class="brand-copy">
              <span class="brand-mark">SIMPLISTART</span>
              <span class="brand-subtitle">{{ settings.site_tagline || "Digital Agency" }}</span>
            </div>
          </NuxtLink>
          <button
            type="button"
            class="site-nav-toggle"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            aria-label="Toggle navigation"
            @click="menuOpen = !menuOpen"
          >
            <span />
            <span />
            <span />
          </button>
          <nav class="site-nav" :class="{ 'site-nav--open': menuOpen }">
            <NuxtLink
              v-for="item in primaryNavItems"
              :key="item.href"
              :to="item.href"
              class="site-nav__link"
              :class="{ 'site-nav__link--active': route.path === item.href }"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
        <div v-if="actionItems.length" class="site-header__actions desktop-only">
          <NuxtLink v-for="item in actionItems" :key="`header-action-${item.href}`" :to="item.href" class="site-header__action">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
  <Transition name="nav-drawer">
    <div v-if="menuOpen" class="site-nav-drawer-backdrop" @click="menuOpen = false">
      <aside class="site-nav-drawer" @click.stop>
        <div class="site-nav-drawer__header">
          <span>Menu</span>
          <button type="button" class="site-nav-drawer__close" aria-label="Close navigation" @click="menuOpen = false">
            &times;
          </button>
        </div>
        <nav class="site-nav-drawer__links">
          <NuxtLink
            v-for="item in settings.nav_items"
            :key="`drawer-${item.href}`"
            :to="item.href"
            class="site-nav-drawer__link"
            :class="{ 'site-nav-drawer__link--active': route.path === item.href }"
            @click="menuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>
    </div>
  </Transition>
</template>
