type ScrollTargetTop = { top: number } | { scrollToElement: HTMLElement; padding?: number; useBounding?: boolean };
type ScrollTargetLeft = { left: number } | { scrollToElement: HTMLElement; padding?: number; useBounding?: boolean };
type ScrollTargetCenterVertical = { top: number; height: number } | { scrollToElement: HTMLElement };

type ScrollTarget =
  | ({ mode: "top" } & ScrollTargetTop)
  | ({ mode: "left" } & ScrollTargetLeft)
  | ({ mode: "center-vertical" } & ScrollTargetCenterVertical);

export function scrollToElement(
  scrollableElement: HTMLElement | Window,
  scrollTarget: ScrollTarget,
  behavior: ScrollBehavior = "smooth",
) {
  const position = getScrollPosition(scrollTarget, scrollableElement);
  scrollableElement.scrollTo({ ...position, behavior });
}

function getScrollTopPosition(scrollTarget: ScrollTargetTop, scrollableElement: HTMLElement | Window) {
  if ("top" in scrollTarget) return { top: scrollTarget.top };
  const padding = scrollTarget.padding ?? 0;
  if (scrollTarget.useBounding)
    return {
      top:
        scrollTarget.scrollToElement.getBoundingClientRect().top +
        (isWindow(scrollableElement) ? window.scrollY : scrollableElement.scrollTop) +
        padding,
    };
  return { top: scrollTarget.scrollToElement.offsetTop + padding };
}

function getScrollLeftPosition(scrollTarget: ScrollTargetLeft, scrollableElement: HTMLElement | Window) {
  if ("left" in scrollTarget) return { left: scrollTarget.left };
  const padding = scrollTarget.padding ?? 0;
  if (scrollTarget.useBounding)
    return {
      left:
        scrollTarget.scrollToElement.getBoundingClientRect().left +
        (isWindow(scrollableElement) ? window.scrollY : scrollableElement.scrollTop) +
        +padding,
    };
  return { left: scrollTarget.scrollToElement.offsetLeft + padding };
}

function getScrollCenterVerticalPosition(
  scrollTarget: ScrollTargetCenterVertical,
  scrollableElement: HTMLElement | Window,
) {
  const scrollElementOffset = (isWindow(scrollableElement) ? window.innerHeight : scrollableElement.offsetHeight) / 2;

  if ("top" in scrollTarget) return { top: scrollTarget.top + scrollTarget.height / 2 - scrollElementOffset };
  return {
    top: scrollTarget.scrollToElement.offsetTop + scrollTarget.scrollToElement.offsetHeight / 2 - scrollElementOffset,
  };
}

function getScrollPosition(scrollTarget: ScrollTarget, scrollableElement: HTMLElement | Window) {
  if (scrollTarget.mode === "top") return getScrollTopPosition(scrollTarget, scrollableElement);
  if (scrollTarget.mode === "left") return getScrollLeftPosition(scrollTarget, scrollableElement);
  if (scrollTarget.mode === "center-vertical") return getScrollCenterVerticalPosition(scrollTarget, scrollableElement);

  throw new Error("Not implemented");
}

function isWindow(element: HTMLElement | Window): element is Window {
  return element === window;
}
