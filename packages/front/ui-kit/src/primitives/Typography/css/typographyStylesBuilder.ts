export function buildTypographyVariant(fontSize: number, lineHeight: string, fontWeight: 400 | 500 | 700) {
  return { fontSize: `${fontSize}px`, lineHeight, fontWeight, fontFamily: "Roboto, sans-serif, Arial" };
}
