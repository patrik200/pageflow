import { ContainerInstance } from "typedi";
import { createRedirect, NextPageSystemResult, PageDataLoaderResult, ServerSidePropsContext } from "@app/front-kit";

import { isInvitationsPage } from "internal/isInvitationsPage";

import { handleToken } from "./handleToken";
import { handleTokenBrowser } from "./handleTokenBrowser";
import { isAuthPage } from "../isAuthPage";

export async function initializeAccessToken(
  context: ServerSidePropsContext,
  container: ContainerInstance,
): Promise<PageDataLoaderResult | NextPageSystemResult> {
  const authorized = await handleToken(context, container);
  if (authorized) {
    if (isInvitationsPage(context)) return createRedirect(context, "/");

    return [];
  }
  if (isAuthPage(context) || isInvitationsPage(context)) return [];
  return createRedirect(context, "auth/login");
}

export function initializeAccessTokenBrowser(container: ContainerInstance) {
  handleTokenBrowser(container);
}
