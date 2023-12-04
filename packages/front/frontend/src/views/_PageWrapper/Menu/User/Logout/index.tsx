import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

import { buttonStyles, logoutButtonIconStyles } from "./style.css";

function Logout() {
  const push = useRouter().push;
  const { logout } = useViewContext().containerInstance.get(ProfileStorage);
  const handleLogout = React.useCallback(async () => {
    await logout();
    await push.current("/auth/login");
  }, [logout, push]);

  const [{ loading }, asyncHandleLogout] = useAsyncFn(handleLogout, [handleLogout]);

  return (
    <Button
      className={buttonStyles}
      leftIconClassName={logoutButtonIconStyles}
      loading={loading}
      iconLeft="logoutBoxLine"
      type="WITHOUT_BORDER"
      onClick={asyncHandleLogout}
    />
  );
}

export default observer(Logout);
