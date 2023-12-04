import { globalStyle, style } from "@vanilla-extract/css";
import { padding } from "polished";
import { globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  gap: 30,
  background: globalThemeColorVars.backgroundCard,
});

globalStyle(`${wrapperStyles}:not(:last-child)`, {
  marginBottom: 32,
});

export const dragIconStyles = style({
  width: 24,
  height: 24,
  marginTop: 9,
  padding: 4,
  flexShrink: 0,
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  flex: 1,
});

export const titleRowWrapper = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

export const nameFieldStyles = style({
  flex: 1,
  marginRight: 8,
});

export const usersListWrapperStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const actionsStyles = style({
  display: "flex",
  flexDirection: "column",
});

export const buttonsStyles = style({
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  gap: 10,
});

export const deleteRowButtonStyles = style({
  ...padding(null, 10),
  marginLeft: -16,
});
