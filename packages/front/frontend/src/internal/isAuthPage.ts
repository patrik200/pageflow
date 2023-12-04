import { ServerSidePropsContext } from "@app/front-kit";

export function isAuthPageUrl(url: string) {
  return url.startsWith("/auth");
}

export function isAuthPage(context: ServerSidePropsContext) {
  return isAuthPageUrl(context.resolvedUrl);
}
