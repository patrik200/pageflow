import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";

import { rootNamespaceClassName } from "../consts";

import { colors, globalThemeColorVars } from "../theme/index.css";

createGlobalTheme(`.${rootNamespaceClassName}`, globalThemeColorVars, colors);

globalStyle(`.${rootNamespaceClassName}-app-reset *`, {
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
  WebkitFontSmoothing: "antialiased",
});

globalStyle(`.${rootNamespaceClassName}-app`, { fontSize: 16 });

globalStyle(`.${rootNamespaceClassName}-app button`, {
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
});

globalStyle(`.${rootNamespaceClassName}-app a`, {
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  WebkitTouchCallout: "none",
});

globalStyle("*", {
  touchAction: "manipulation",
});

if (process.env.NODE_ENV === "development") {
  globalStyle(`.${rootNamespaceClassName} nextjs-portal`, {
    lineHeight: 1.9,
  });
}
