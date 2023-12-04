import { ServerSidePropsContext } from "@app/front-kit";
import { ContainerInstance } from "typedi";
import { waitFor } from "@worksolutions/utils";

import { AllUsersStorage } from "core/storages/profile/allUsers";

import { getTokenValid } from "../profile";

export async function initializeAllUsers(context: ServerSidePropsContext, container: ContainerInstance) {
  try {
    await waitFor(() => getTokenValid(context) !== undefined, 10000, 40);
    if (!getTokenValid(context)) return false;
    const allUsersStorage = container.get(AllUsersStorage);
    const allUsersResult = await allUsersStorage.loadAllUsers();
    return allUsersResult.success;
  } catch (e) {
    return false;
  }
}
