import { getSettings } from "~/server/utils/content";

export default defineEventHandler(async () => getSettings());
