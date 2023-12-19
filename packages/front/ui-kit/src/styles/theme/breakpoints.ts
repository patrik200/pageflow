import { breakpointsBuilder } from "../../utils";

export const breakpointMobileMin = 375;
export const breakpointMobileMax = 767;
export const breakpointTabletMin = 769;
export const breakpointTabletMax = 1023;
export const breakpointMiniDesktopMin = 1024;
export const breakpointMiniDesktopMax = 1365;
export const breakpointDesktopMin = 1366;

export const createBreakpoint = breakpointsBuilder({
  mobile: `(min-width: ${breakpointMobileMin}px) and (max-width: ${breakpointMobileMax}px)`,
  tablet: `(min-width: ${breakpointTabletMin}px) and (max-width: ${breakpointTabletMax}px)`,
  miniDesktop: `(min-width: ${breakpointMiniDesktopMin}px) and (max-width: ${breakpointMiniDesktopMax}px)`,
  desktop: `min-width: ${breakpointDesktopMin}px`,
});

export const createBreakpointFrom = breakpointsBuilder({
  mobile: `(min-width: ${breakpointMobileMin}px)`,
  tablet: `(min-width: ${breakpointTabletMin}px)`,
  miniDesktop: `(min-width: ${breakpointMiniDesktopMin}px)`,
  desktop: `(min-width: ${breakpointDesktopMin}px)`,
});
