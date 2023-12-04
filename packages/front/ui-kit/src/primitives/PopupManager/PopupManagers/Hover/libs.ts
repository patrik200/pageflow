import debounce from "lodash.debounce";

import { universalMouseEnter } from "utils/universalMouseEnter";

export function handleTriggerElementEventsForHover(
  { triggerHTMLNode, popupHTMLNode }: { triggerHTMLNode: HTMLElement; popupHTMLNode: HTMLElement | null },
  { hideDelay, showDelay }: { showDelay: number; hideDelay: number },
  context: { show: () => void; hide: () => void },
) {
  let showTimeout: any;
  let hideTimeout: any;

  let visible = false;
  const updateVisibility = debounce(() => (visible ? context!.show() : context!.hide()), 2, { leading: false });

  function show() {
    visible = true;
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(updateVisibility, showDelay);
  }

  function hide() {
    visible = false;
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(updateVisibility, hideDelay);
  }

  const disposeTriggerEvents = universalMouseEnter(triggerHTMLNode, show, hide);
  const disposePopupEvents = popupHTMLNode ? universalMouseEnter(popupHTMLNode, show, hide) : undefined;

  return () => {
    disposeTriggerEvents();
    if (disposePopupEvents) disposePopupEvents();
  };
}
