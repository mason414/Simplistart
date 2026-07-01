<script setup lang="ts">
import type { PageContent, PageSection, ProjectEntry, SiteSettings, AiCapabilityItem } from "~/types/content";

const props = defineProps<{
  page: PageContent;
  projects?: ProjectEntry[];
  settings?: SiteSettings;
}>();

const route = useRoute();
const activeFilters = reactive<Record<string, string>>({});
const submitting = ref(false);
const submitted = ref(false);
const revealItems = ref<HTMLElement[]>([]);
const storageKey = computed(() => `simplistart-form-submitted:${props.page.slug}`);
let revealObserver: IntersectionObserver | null = null;

const visibleSections = computed(() => (props.page.sections ?? []).filter((section) => section.enabled !== false));

function sectionKey(section: PageSection, index: number) {
  return section.section_id || `${section.type}-${index}`;
}

function featuredProjects(section: Extract<PageSection, { type: "featured_projects" }>) {
  return (section.project_slugs ?? [])
    .map((slug) => props.projects?.find((project) => project.slug === slug))
    .filter(Boolean) as ProjectEntry[];
}

function filteredProjects(section: Extract<PageSection, { type: "project_grid" }>, index: number) {
  const allProjects = props.projects ?? [];
  const key = sectionKey(section, index);
  const active = activeFilters[key] ?? section.filter_labels[0] ?? "All";

  if (active === "All") {
    return allProjects;
  }

  return allProjects.filter((project) => project.category === active);
}

function setRevealItem(el: Element | null) {
  if (el instanceof HTMLElement && !revealItems.value.includes(el)) {
    revealItems.value.push(el);
  }
}

function initRevealObserver() {
  if (!import.meta.client) {
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.value.forEach((item) => revealObserver?.observe(item));
}

function normalizePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement | null;
  if (!input) {
    return;
  }

  const digits = input.value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) {
    input.value = digits;
    return;
  }

  if (digits.length <= 6) {
    input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return;
  }

  input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function handleFormSubmit(event: Event) {
  if (submitted.value || submitting.value) {
    event.preventDefault();
    return;
  }

  submitting.value = true;
}

onMounted(async () => {
  if (import.meta.client) {
    submitted.value = window.localStorage.getItem(storageKey.value) === "true";
  }

  await nextTick();
  initRevealObserver();
});

watch(
  () => props.page.sections,
  async () => {
    revealItems.value = [];
    await nextTick();
    initRevealObserver();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  revealObserver?.disconnect();
});
</script>

<template>
  <div>
    <template v-for="(section, index) in visibleSections" :key="sectionKey(section, index)">
      <section v-if="section.type === 'intro'" class="section two-column">
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
        </div>
        <p class="section-copy">{{ section.body }}</p>
      </section>

      <section v-else-if="section.type === 'stats'" class="section stats-section">
        <div v-if="section.headline" class="section-heading section-heading--compact">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
        </div>
        <div class="stats-grid">
          <article
            v-for="(item, itemIndex) in section.items"
            :key="`${item.value}-${item.label}`"
            :ref="setRevealItem"
            class="stat-card reveal-on-scroll"
            :style="{ transitionDelay: `${itemIndex * 120}ms` }"
          >
            <div v-if="item.image" class="stat-card__media">
              <img :src="item.image" :alt="item.value" loading="lazy" />
            </div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </section>

      <section v-else-if="section.type === 'services'" class="section">
        <div class="section-heading">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p v-if="section.body">{{ section.body }}</p>
        </div>
        <div class="service-grid">
          <article
            v-for="(item, itemIndex) in section.items"
            :key="item.title"
            :ref="setRevealItem"
            class="service-card reveal-on-scroll"
            :style="{ transitionDelay: `${itemIndex * 90}ms` }"
          >
            <span class="service-card__index">0{{ itemIndex + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <section v-else-if="section.type === 'ai_capabilities'" class="section ai-capabilities">
        <div class="section-heading">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p v-if="section.body">{{ section.body }}</p>
        </div>
        <div class="ai-capabilities-grid">
          <article
            v-for="(item, itemIndex) in section.items"
            :key="item.title"
            :ref="setRevealItem"
            class="ai-capability-card reveal-on-scroll"
            :style="{ transitionDelay: `${itemIndex * 90}ms` }"
          >
            <span class="ai-capability-card__index">0{{ itemIndex + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <section v-else-if="section.type === 'ai_process'" class="section ai-process">
        <div class="section-heading">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p v-if="section.body">{{ section.body }}</p>
        </div>
        <div class="ai-process-steps">
          <article
            v-for="(step, stepIndex) in section.steps"
            :key="step.title"
            :ref="setRevealItem"
            class="ai-process-step reveal-on-scroll"
            :style="{ transitionDelay: `${stepIndex * 100}ms` }"
          >
            <span class="ai-process-step__number">{{ stepIndex + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </article>
        </div>
      </section>

      <section v-else-if="section.type === 'featured_projects'" class="section featured-layout">
        <div class="featured-copy">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p>{{ section.body }}</p>
        </div>
        <div class="featured-stack">
          <ProjectCard
            v-for="project in featuredProjects(section)"
            :key="project.slug"
            :project="project"
            featured
          />
        </div>
      </section>

      <section v-else-if="section.type === 'callout'" class="section section--callout">
        <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
        <h2>{{ section.headline }}</h2>
        <p>{{ section.body }}</p>
      </section>

      <section v-else-if="section.type === 'profile'" class="section profile-section">
        <div class="profile-copy">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
        </div>
        <div class="profile-card">
          <img v-if="section.portrait" :src="section.portrait" :alt="section.headline" class="profile-card__portrait" />
          <p v-if="section.role" class="profile-card__role">{{ section.role }}</p>
          <p v-if="section.detail" class="profile-card__detail">{{ section.detail }}</p>
          <div v-if="section.stats?.length" class="profile-card__stats">
            <div v-for="item in section.stats" :key="`${item.value}-${item.label}`">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="section.type === 'story_blocks'" class="section story-grid">
        <article
          v-for="(block, blockIndex) in section.blocks"
          :key="block.headline"
          :ref="setRevealItem"
          class="story-block reveal-on-scroll"
          :class="{ 'story-block--reverse': block.image_alignment === 'left' }"
          :style="{ transitionDelay: `${blockIndex * 100}ms` }"
        >
          <div class="story-block__visual">
            <img v-if="block.image" :src="block.image" :alt="block.headline" />
            <div v-else class="story-block__placeholder">
              <span>{{ blockIndex + 1 }}</span>
            </div>
          </div>
          <div>
            <h2>{{ block.headline }}</h2>
            <p>{{ block.body }}</p>
          </div>
        </article>
      </section>

      <section v-else-if="section.type === 'project_grid'" class="section section--project-grid">
        <div class="filter-bar">
          <button
            v-for="label in section.filter_labels"
            :key="label"
            type="button"
            :class="{ active: (activeFilters[sectionKey(section, index)] ?? section.filter_labels[0] ?? 'All') === label }"
            @click="activeFilters[sectionKey(section, index)] = label"
          >
            {{ label }}
          </button>
        </div>
        <div class="projects-grid">
          <ProjectCard v-for="project in filteredProjects(section, index)" :key="project.slug" :project="project" />
        </div>
      </section>

      <section v-else-if="section.type === 'contact_info'" class="section two-column">
        <div>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
        </div>
        <div v-if="settings" class="contact-details">
          <p v-for="line in settings.address_lines" :key="line">{{ line }}</p>
          <a :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
          <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        </div>
      </section>

      <section v-else-if="section.type === 'contact_cta'" :id="section.anchor_id" class="section contact-banner">
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p>{{ section.body }}</p>
        </div>
        <NuxtLink class="button-link" :to="section.link_href">
          {{ section.link_label }}
        </NuxtLink>
      </section>

      <section v-else-if="section.type === 'contact_form'" class="section form-section">
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
        </div>
        <div v-if="submitted" class="form-thankyou">
          <h3>Message received.</h3>
          <p>{{ section.success_message || "Thanks for reaching out. The Simplistart team will follow up soon." }}</p>
        </div>
        <form
          v-else
          name="contact"
          method="POST"
          action="/contact/success"
          data-netlify="true"
          netlify-honeypot="bot-field"
          class="site-form"
          @submit="handleFormSubmit"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="page" :value="route.path" />
          <input type="hidden" name="bot-field" />
          <label class="form-field">
            <span>Name</span>
            <input type="text" name="name" maxlength="80" autocomplete="name" required />
          </label>
          <label class="form-field">
            <span>Email</span>
            <input type="email" name="email" maxlength="120" autocomplete="email" inputmode="email" required />
          </label>
          <label class="form-field">
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              maxlength="14"
              inputmode="tel"
              autocomplete="tel"
              pattern="^\\(\\d{3}\\) \\d{3}-\\d{4}$"
              placeholder="(555) 555-5555"
              required
              @input="normalizePhoneInput"
            />
          </label>
          <label class="form-field">
            <span>Company</span>
            <input type="text" name="company" maxlength="120" autocomplete="organization" />
          </label>
          <label class="form-field form-field--full">
            <span>What can we help you with?</span>
            <textarea name="message" rows="4" maxlength="1200" placeholder="Tell us about the problems you are facing and what you need help with..." required />
          </label>
          <button type="submit" class="button-link" :disabled="submitting">
            {{ submitting ? "Sending..." : section.submit_label }}
          </button>
        </form>
      </section>
    </template>
  </div>
</template>
