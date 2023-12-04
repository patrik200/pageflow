export const createPageLinkItem = (page: number) => ({
  text: page.toString(),
  page,
});

export const createTriplePointItem = (page: number) => ({ text: "...", page });

export function controlKeyIsPressed(event: any) {
  return event.ctrlKey || event.metaKey;
}
