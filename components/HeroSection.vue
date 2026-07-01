<script setup lang="ts">
const props = defineProps<{
  eyebrow?: string;
  headline: string;
  subhead?: string;
  image?: string;
  video?: string;
  mediaType?: "image" | "video";
  compact?: boolean;
  fullBleed?: boolean;
  homeHero?: boolean;
  hideCopy?: boolean;
  videoCtaLabel?: string;
  videoEmbedUrl?: string;
  videoAutoOpen?: boolean;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}>();

const videoOpen = ref(false);

function getEmbedUrl(url?: string) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\/+/, "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const parts = parsed.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
      const videoId = parts[0];
      const privateHash = parts[1];

      if (videoId && /^\d+$/.test(videoId)) {
        return privateHash
          ? `https://player.vimeo.com/video/${videoId}?h=${privateHash}`
          : `https://player.vimeo.com/video/${videoId}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

const resolvedVideoEmbedUrl = computed(() => getEmbedUrl(props.videoEmbedUrl));
const resolvedVideoSrc = computed(() => {
  if (!resolvedVideoEmbedUrl.value) {
    return "";
  }

  const separator = resolvedVideoEmbedUrl.value.includes("?") ? "&" : "?";

  if (resolvedVideoEmbedUrl.value.includes("player.vimeo.com")) {
    return `${resolvedVideoEmbedUrl.value}${separator}autoplay=1&title=0&byline=0&portrait=0`;
  }

  return `${resolvedVideoEmbedUrl.value}${separator}autoplay=1`;
});

onMounted(() => {
  if (import.meta.client && props.videoAutoOpen && resolvedVideoEmbedUrl.value) {
    videoOpen.value = true;
  }
});

watch(videoOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <section class="hero" :class="{ 'hero--compact': compact, 'hero--full': fullBleed, 'hero--home': homeHero }">
    <div v-if="(mediaType === 'video' || video) && video" class="hero-media">
      <video :src="video" autoplay muted loop playsinline />
    </div>
    <div v-else-if="image" class="hero-media hero-media--image">
      <img :src="image" :alt="headline" />
    </div>
    <div v-if="!hideCopy" class="hero-layout">
      <div class="hero-copy">
        <div class="hero-copy__primary">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h1>{{ headline }}</h1>
          <p v-if="subhead" class="hero-subhead">{{ subhead }}</p>
          <div v-if="primaryAction || secondaryAction" class="hero-actions">
            <NuxtLink v-if="primaryAction" :to="primaryAction.href" class="button-link">
              {{ primaryAction.label }}
            </NuxtLink>
            <NuxtLink v-if="secondaryAction" :to="secondaryAction.href" class="button-link button-link--ghost">
              {{ secondaryAction.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="resolvedVideoEmbedUrl && videoCtaLabel"
      type="button"
      class="hero-video-cta"
      @click="videoOpen = true"
    >
      <span class="hero-video-cta__icon" aria-hidden="true" />
      <span>{{ videoCtaLabel }}</span>
    </button>
  </section>

  <Teleport to="body">
    <div v-if="videoOpen" class="modal-backdrop" @click="videoOpen = false">
      <div class="video-lightbox" @click.stop>
        <div class="video-lightbox__frame">
          <iframe
            :src="resolvedVideoSrc"
            :title="videoCtaLabel || headline"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
