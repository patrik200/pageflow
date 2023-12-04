export function handleTriggerElementEventsForClick(
  triggerElement: HTMLElement,
  toggleOnClick: boolean | undefined,
  context: { toggle: () => void; show: () => void },
) {
  const handler = toggleOnClick ? context.toggle : context.show;
  triggerElement.addEventListener("click", handler);
  return () => triggerElement.removeEventListener("click", handler);
}
