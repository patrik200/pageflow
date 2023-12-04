import { globalExternalPageDataLoader } from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

globalExternalPageDataLoader.set("load profile", async function (context, container) {
  return [{ token: ProfileStorage.token, plainObject: container.get(ProfileStorage).plainObject }];
});
