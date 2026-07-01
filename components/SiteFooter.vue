<script setup lang="ts">
import type { SiteSettings } from "~/types/content";

const props = defineProps<{
  settings: SiteSettings;
}>();

const currentYear = new Date().getFullYear();
const addressLines = computed(() => props.settings.address_lines ?? []);
const footerMenu = computed(() => props.settings.footer_menu ?? []);
const socialLinks = computed(() => props.settings.social_links ?? []);

const copyrightText = computed(() => {
  const raw = props.settings.copyright?.trim();
  if (!raw) {
    return `Copyright ©${currentYear} ${props.settings.site_title}. All rights reserved.`;
  }

  if (/\b20\d{2}\b/.test(raw)) {
    return raw.replace(/\b20\d{2}\b/, String(currentYear));
  }

  return raw;
});
</script>

<template>
  <footer class="site-footer">
    <div class="footer-bar">
      <div class="footer-cell footer-cell--logo">
        <NuxtLink to="/" class="footer-brand">
          <img
            v-if="settings.brand_logo"
            :src="settings.brand_logo"
            :alt="settings.site_title"
            class="footer-brand__logo"
          />
          <span v-else class="footer-brand__wordmark">{{ settings.site_title }}</span>
        </NuxtLink>
      </div>

      <div class="footer-cell footer-cell--pages">
        <div class="footer-stack">
          <NuxtLink v-for="item in footerMenu" :key="item.href" :to="item.href" class="footer-link">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <div class="footer-cell footer-cell--socials">
        <div class="footer-stack">
          <a v-for="link in socialLinks" :key="link.label" :href="link.href" class="footer-link" target="_blank" rel="noreferrer">
            {{ link.label }}
          </a>
        </div>
      </div>

      <div class="footer-cell footer-cell--copyright">
        <p class="footer-copy footer-copy--muted">{{ copyrightText }}</p>
      </div>

      <div class="footer-cell footer-cell--description">
        <p class="footer-statement">{{ settings.footer_statement }}</p>
        <p v-if="settings.site_tagline" class="footer-copy footer-copy--muted">{{ settings.site_tagline }}</p>
      </div>

      <div class="footer-cell footer-cell--contact">
        <div class="footer-contact-stack">
          <p v-for="line in addressLines" :key="line" class="footer-copy">{{ line }}</p>
          <a class="footer-link" :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
          <a class="footer-link" :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
