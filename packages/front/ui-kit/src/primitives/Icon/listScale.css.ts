import { globalStyle, GlobalStyleRule, style } from "@vanilla-extract/css";

export const iconScaleStyles = style({});

function createScale(name: string, scale: number, customStyles?: GlobalStyleRule) {
  globalStyle(`${iconScaleStyles}.internal-icon-${name} > path`, {
    transformOrigin: "center",
    transform: `scale(${scale})`,
    ...customStyles,
  });
}

createScale("arrowUpLine", 1.4);
createScale("arrowDownLine", 1.4);
createScale("arrowLeftLine", 1.4);
createScale("arrowRightLine", 1.4);
createScale("arrowUpSLine", 1.6);
createScale("arrowDownSLine", 1.6);
createScale("arrowLeftSLine", 1.6);
createScale("arrowRightSLine", 1.6);
createScale("plusLine", 1.6);
createScale("minusLine", 1.6);
createScale("closeLine", 1.6);
createScale("checkLine", 1.1, { stroke: "currentColor", strokeWidth: 1 });
createScale("draggable", 1.3);
createScale("more2Line", 1.3);
createScale("userLine", 1.05);
