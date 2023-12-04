import { ServerSidePropsContext } from "@app/front-kit";

export function isInvitationsPage(context: ServerSidePropsContext) {
  return context.resolvedUrl.startsWith("/invitations");
}
