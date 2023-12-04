import { ServerSidePropsContext } from "@app/front-kit";
import { ContainerInstance } from "typedi";
import { waitFor } from "@worksolutions/utils";

import { ProfileStorage } from "core/storages/profile/profile";

export function getTokenValid(context: ServerSidePropsContext) {
  return (context.req as any).__tokenValid as boolean | undefined;
}

export async function initializeProfile(context: ServerSidePropsContext, container: ContainerInstance) {
  try {
    await waitFor(() => getTokenValid(context) !== undefined, 10000, 40);
    if (!getTokenValid(context)) return false;
    const profileStorage = container.get(ProfileStorage);
    const profileResult = await profileStorage.loadProfile();
    return profileResult.success;
  } catch (e) {
    return false;
  }
}
