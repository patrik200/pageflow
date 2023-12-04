import React from "react";
import { useRouter, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { UserDetailStorage } from "core/storages/user/userDetail";
import { ProfileStorage } from "core/storages/profile/profile";

export function useLoadUser() {
  const { containerInstance } = useViewContext();
  const { user: detailUser, loadUser: userStorageLoadUser } = containerInstance.get(UserDetailStorage);
  const { user: profileUser } = containerInstance.get(ProfileStorage);

  const { id: userId } = useRouter().query as { id?: string; };
  const [, asyncUserStorageLoadUser] = useAsyncFn(userStorageLoadUser, [userStorageLoadUser]);

  React.useEffect(
    () => void asyncUserStorageLoadUser(userId ?? profileUser.id),
    [asyncUserStorageLoadUser, profileUser.id, userId]
  );

  return detailUser;
}
