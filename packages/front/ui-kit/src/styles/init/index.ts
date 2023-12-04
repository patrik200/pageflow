import "./globals.css";
import "./fonts.css";

export const windowInnerHeightRaw = "--window-inner-height";
export const windowInnerHeightVar = `var(${windowInnerHeightRaw})`;

if (typeof window !== "undefined") {
  // eslint-disable-next-line no-inner-declarations
  function syncHeight() {
    document.documentElement.style.setProperty(windowInnerHeightRaw, `${window.innerHeight}px`);
  }

  window.addEventListener("resize", syncHeight);
  syncHeight();
}
