import { globalStyle } from "@vanilla-extract/css";
import { rootNamespaceClassName } from "@app/ui-kit";

if (process.env.NODE_ENV === "development") {
  globalStyle(`.${rootNamespaceClassName} nextjs-portal`, {
    lineHeight: 1.9,
  });
}
