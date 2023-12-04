import { breakpointsBuilder } from "../../utils";

export const breakpointMobileMin = "375px";
export const breakpointMobileMax = "767px";
export const breakpointTabletMin = "768px";
export const breakpointTabletMax = "1023px";
export const breakpointMiniDesktopMin = "1024px";
export const breakpointMiniDesktopMax = "1365px";
export const breakpointDesktopMin = "1366px";

export const createBreakpoint = breakpointsBuilder({
  mobile: `(min-width: ${breakpointMobileMin}) and (max-width: ${breakpointMobileMax})`,
  tablet: `(min-width: ${breakpointTabletMin}) and (max-width: ${breakpointTabletMax})`,
  miniDesktop: `(min-width: ${breakpointMiniDesktopMin}) and (max-width: ${breakpointMiniDesktopMax})`,
  desktop: "min-width: " + breakpointDesktopMin,
});
