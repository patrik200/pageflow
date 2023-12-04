import { isArray } from "@worksolutions/utils";
import {
  createRedirect,
  globalAsyncPageDataLoader,
  globalExternalPageDataLoader,
  globalInternalPageDataLoader,
} from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";
import { AllUsersStorage } from "core/storages/profile/allUsers";
import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import { isAuthPage } from "./isAuthPage";
import { initializeAccessToken } from "./accessToken";
import { initializeClient } from "./client";
import { initializeProfile } from "./profile";
import { initializeAllUsers } from "./users";
import { initializeDictionaries } from "./dictionaries";
import { isInvitationsPage } from "./isInvitationsPage";

globalInternalPageDataLoader.set("load context", async function (context, container) {
  const clientResult = await initializeClient(context, container);
  if (!isArray(clientResult)) return clientResult;
  if (isInvitationsPage(context)) return clientResult;
  const tokenResult = await initializeAccessToken(context, container);
  if (!isArray(tokenResult)) return tokenResult;
  return [...tokenResult, ...clientResult];
});

globalExternalPageDataLoader.set("load profile", async function (context, container) {
  if (isAuthPage(context)) return [];
  if (isInvitationsPage(context)) return [];
  const success = await initializeProfile(context, container);
  if (!success) return createRedirect(context, "auth/login");
  return [{ token: ProfileStorage.token, plainObject: container.get(ProfileStorage).plainObject }];
});

globalAsyncPageDataLoader.set("load all users", async function (context, container) {
  if (isAuthPage(context)) return [];
  if (isInvitationsPage(context)) return [];
  await initializeAllUsers(context, container);
  return [{ token: AllUsersStorage.token, plainObject: container.get(AllUsersStorage).plainObject }];
});

globalAsyncPageDataLoader.set("load dictionaries", async function (context, container) {
  if (isAuthPage(context)) return [];
  if (isInvitationsPage(context)) return [];
  await initializeDictionaries(context, container);
  return [
    { token: DictionariesCommonStorage.token, plainObject: container.get(DictionariesCommonStorage).plainObject },
  ];
});
