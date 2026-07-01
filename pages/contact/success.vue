<script setup lang="ts">
const { data: settings } = await useSettingsData();

if (import.meta.client) {
  window.localStorage.setItem("simplistart-form-submitted:contact", "true");
}
</script>

<template>
  <div class="page-shell">
    <section class="hero hero--compact">
      <div class="hero-copy">
        <div class="hero-copy__primary">
          <p class="eyebrow">Contact</p>
          <h1>Thanks. We’ll be in touch soon.</h1>
          <p class="hero-subhead">
            Your message landed. If the project is time-sensitive, you can also reach the team directly
            <span v-if="settings"> at {{ settings.email }}</span>.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/" class="button-link">Back Home</NuxtLink>
            <NuxtLink to="/work" class="button-link button-link--ghost">See Work</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
