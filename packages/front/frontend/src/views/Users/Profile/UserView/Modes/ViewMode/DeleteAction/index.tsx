import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { UserDetailStorage } from "core/storages/user/userDetail";

import DeleteUserModal from "./DeleteUserModal";

function DeleteUserAction() {
  const { user } = useViewContext().containerInstance.get(UserDetailStorage);
  const [opened, open, close] = useBoolean(false);

  if (!user!.canDelete) return null;

  return (
    <>
      <Button iconLeft="deleteBinLine" type="WITHOUT_BORDER" onClick={open} />
      <DeleteUserModal opened={opened} close={close} />
    </>
  );
}

export default observer(DeleteUserAction);
