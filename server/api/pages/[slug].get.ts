import { getPageBySlug } from "~/server/utils/content";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  const page = await getPageBySlug(slug);
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  return page;
});
