export const NEXT_INTERNAL_ASSETS_PATH = "/_next";
export const NEXT_INTERNAL_IMAGES_PATH = "/images";

export function isNextInternalResource(url: string) {
  return url.startsWith(NEXT_INTERNAL_ASSETS_PATH) || url.startsWith(NEXT_INTERNAL_IMAGES_PATH);
}
