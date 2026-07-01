import { getProjectBySlug } from "~/server/utils/content";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const project = await getProjectBySlug(slug || "");

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }

  return project;
});
