import { getProjects } from "~/server/utils/content";

export default defineEventHandler(async () => getProjects());
