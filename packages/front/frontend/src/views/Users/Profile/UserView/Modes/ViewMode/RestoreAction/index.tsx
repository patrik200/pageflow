import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { UserDetailStorage } from "core/storages/user/userDetail";

import RestoreUserModal from "./RestoreUserModal";

function RestoreUserAction() {
  const { user } = useViewContext().containerInstance.get(UserDetailStorage);
  const [opened, open, close] = useBoolean(false);

  if (!user!.canRestore) return null;

  return (
    <>
      <Button iconLeft="loopLeftLine" type="WITHOUT_BORDER" onClick={open} />
      <RestoreUserModal opened={opened} close={close} />
    </>
  );
}

export default observer(RestoreUserAction);
