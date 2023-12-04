import { globalStyle, style } from "@vanilla-extract/css";
import { body2medium, body2regular, globalThemeColorVars, h1bold, h2bold, h3medium, h4medium } from "@app/ui-kit";
import { padding } from "polished";

export const textStyles = style([{ whiteSpace: "pre", lineHeight: 0, wordBreak: "break-word" }]);

globalStyle(`${textStyles} > *`, { ...body2regular, color: globalThemeColorVars.textPrimary, whiteSpace: "pre-wrap" });

globalStyle(`${textStyles} h1`, { ...h1bold, marginBottom: 8 });
globalStyle(`${textStyles} h2`, { ...h2bold, marginBottom: 6 });
globalStyle(`${textStyles} h3`, { ...h3medium, marginBottom: 4 });
globalStyle(`${textStyles} h4`, { ...h4medium, marginBottom: 2 });

globalStyle(`${textStyles} blockquote`, {
  paddingLeft: 8,
  borderLeft: "5px solid " + globalThemeColorVars.textLabel,
});

globalStyle(`${textStyles} code`, {
  ...padding(3, 8),
  background: globalThemeColorVars.background,
  borderRadius: 6,
});

globalStyle(`${textStyles} ul, ${textStyles} ol`, {
  lineHeight: 0,
  marginLeft: 12,
});
globalStyle(`${textStyles} li`, {
  ...body2regular,
});

globalStyle(`${textStyles} a`, {
  color: globalThemeColorVars.primary,
  ...body2medium,
  textDecoration: "none",
});

globalStyle(`${textStyles} img`, {
  maxWidth: "100%",
});
