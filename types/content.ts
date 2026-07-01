export interface NavItem {
  label: string;
  href: string;
  variant?: "link" | "button";
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  site_title: string;
  site_tagline?: string;
  brand_logo?: string;
  favicon?: string;
  nav_items: NavItem[];
  footer_menu: NavItem[];
  address_lines: string[];
  phone: string;
  email: string;
  social_links: SocialLink[];
  footer_statement: string;
  copyright: string;
}

export interface StatItem {
  value: string;
  label: string;
  image?: string;
}

export interface ServiceItem {
  title: string;
  body: string;
}

export interface StorySection {
  headline: string;
  body: string;
  image?: string;
  image_alignment: "left" | "right";
}

export interface HeroAction {
  label: string;
  href: string;
}

export interface PageHero {
  media_type: "video" | "image";
  image?: string;
  video?: string;
  eyebrow?: string;
  headline: string;
  subhead?: string;
  video_cta_label?: string;
  video_embed_url?: string;
  video_auto_open?: boolean;
  hide_copy?: boolean;
  primary_action?: HeroAction;
  secondary_action?: HeroAction;
}

export interface PageSectionBase {
  type: string;
  enabled?: boolean;
  section_id?: string;
}

export interface IntroSection extends PageSectionBase {
  type: "intro";
  eyebrow?: string;
  headline: string;
  body: string;
}

export interface StatsSection extends PageSectionBase {
  type: "stats";
  eyebrow?: string;
  headline: string;
  items: StatItem[];
}

export interface FeaturedProjectsSection extends PageSectionBase {
  type: "featured_projects";
  eyebrow?: string;
  headline: string;
  body: string;
  project_slugs: string[];
}

export interface CalloutSection extends PageSectionBase {
  type: "callout";
  eyebrow?: string;
  headline: string;
  body: string;
}

export interface ServicesSection extends PageSectionBase {
  type: "services";
  eyebrow?: string;
  headline: string;
  body?: string;
  items: ServiceItem[];
}

export interface ContactCtaSection extends PageSectionBase {
  type: "contact_cta";
  anchor_id?: string;
  eyebrow?: string;
  headline: string;
  body: string;
  link_label: string;
  link_href: string;
}

export interface ProfileSection extends PageSectionBase {
  type: "profile";
  eyebrow?: string;
  headline: string;
  body: string;
  role?: string;
  detail?: string;
  portrait?: string;
  stats?: StatItem[];
}

export interface StoryBlocksSection extends PageSectionBase {
  type: "story_blocks";
  blocks: StorySection[];
}

export interface ProjectGridSection extends PageSectionBase {
  type: "project_grid";
  filter_labels: string[];
}

export interface ContactInfoSection extends PageSectionBase {
  type: "contact_info";
  headline: string;
  body: string;
}

export interface ContactFormSection extends PageSectionBase {
  type: "contact_form";
  eyebrow?: string;
  headline: string;
  body: string;
  submit_label: string;
  success_message?: string;
}

export interface AiCapabilityItem {
  title: string;
  body: string;
  icon?: string;
}

export interface AiCapabilitiesSection extends PageSectionBase {
  type: "ai_capabilities";
  eyebrow?: string;
  headline: string;
  body?: string;
  items: AiCapabilityItem[];
}

export interface AiProcessSection extends PageSectionBase {
  type: "ai_process";
  eyebrow?: string;
  headline: string;
  body?: string;
  steps: AiCapabilityItem[];
}

export type PageSection =
  | IntroSection
  | StatsSection
  | FeaturedProjectsSection
  | CalloutSection
  | ServicesSection
  | AiCapabilitiesSection
  | AiProcessSection
  | ContactCtaSection
  | ProfileSection
  | StoryBlocksSection
  | ProjectGridSection
  | ContactInfoSection
  | ContactFormSection;

export interface PageContent {
  title: string;
  slug: string;
  hero: PageHero;
  sections: PageSection[];
}

export interface ProjectEntry {
  title: string;
  slug: string;
  category: string;
  thumbnail?: string;
  hero_image?: string;
  summary?: string;
  description?: string;
  services?: string[];
  outcome?: string;
  external_url?: string;
  gallery?: string[];
  featured_on_home?: boolean;
  featured_order?: number;
  source_folder?: string;
}
