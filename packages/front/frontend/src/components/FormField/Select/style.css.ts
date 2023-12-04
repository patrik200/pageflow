import { globalStyle, style } from "@vanilla-extract/css";
import { padding } from "polished";

export const viewSelectFieldTriggerStyles = style({});

globalStyle(`${viewSelectFieldTriggerStyles} > div`, { border: "none", cursor: "default", ...padding(null, 0) });
