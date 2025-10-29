import { customAlphabet } from "nanoid";

const randomId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

function sanitize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureSlug({
  slug,
  fallback,
  prefix = "item",
}: {
  slug?: string | null;
  fallback?: string | null;
  prefix?: string;
}): string {
  const cleanedSlug = slug ? sanitize(slug) : "";
  if (cleanedSlug) {
    return cleanedSlug;
  }

  const cleanedFallback = fallback ? sanitize(fallback) : "";
  if (cleanedFallback) {
    return `${cleanedFallback}-${randomId()}`;
  }

  return `${prefix}-${randomId()}`;
}
