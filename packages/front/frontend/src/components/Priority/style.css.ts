import { TicketPriorities } from "@app/shared-enums";
import { style, styleVariants } from "@vanilla-extract/css";
import { body3mediumStyles, globalThemeColorVars } from "@app/ui-kit";

export const containerStyles = style({
  display: "flex",
  gap: 8,
});

export const titleStyles = style([body3mediumStyles]);

export const themeColorStyleVariants = styleVariants({
  [TicketPriorities.LOW]: { color: globalThemeColorVars.green },
  [TicketPriorities.MEDIUM]: { color: globalThemeColorVars.orange },
  [TicketPriorities.HIGH]: { color: globalThemeColorVars.red },
});
