import React from "react";

import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import DesktopScroll, { DesktopScrollInterface } from "./InternalComponents/Desktop/DesktopScroll";

export interface ScrollInterface {
  style?: Record<string, any>;
  className?: string;
  children: React.ReactNode;
  desktopScrollbarsAutoHideBehavior?: DesktopScrollInterface["scrollbarsAutoHideBehavior"];
  desktopScrollbarsVisibility?: DesktopScrollInterface["scrollbarsVisibility"];
  scrollProviderRef?: React.Ref<ScrollProviderContextInterface>;
  browserRenderContentWhenScrollProviderIsUnsafe?: boolean;
}

function Scroll(props: ScrollInterface) {
  return <RenderScroller {...props} />;
}

export default React.memo(Scroll);

function RenderScroller({
  className,
  desktopScrollbarsAutoHideBehavior,
  desktopScrollbarsVisibility,
  browserRenderContentWhenScrollProviderIsUnsafe = true,
  ...props
}: Omit<ScrollInterface, "defaultSsrState" | "forceEnable">) {
  return (
    <DesktopScroll
      {...props}
      className={className}
      scrollbarsAutoHideBehavior={desktopScrollbarsAutoHideBehavior}
      scrollbarsVisibility={desktopScrollbarsVisibility}
      browserRenderContentWhenScrollProviderIsUnsafe={browserRenderContentWhenScrollProviderIsUnsafe}
    />
  );
}

export {
  scrollbarBackgroundVar,
  scrollbarBackgroundHoverVar,
  scrollbarBackgroundActiveVar,
} from "./InternalComponents/Desktop/DesktopScroll";

export type { ScrollProviderContextInterface } from "primitives/ScrollProvider";
