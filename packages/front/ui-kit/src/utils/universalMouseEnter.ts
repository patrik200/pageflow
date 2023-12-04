export function universalMouseEnter(element: HTMLElement, onEnter: () => void, onOut: () => void) {
  element.addEventListener("mouseenter", onEnter);
  element.addEventListener("mouseleave", onOut);

  return () => {
    element.removeEventListener("mouseenter", onEnter);
    element.removeEventListener("mouseleave", onOut);
  };
}
