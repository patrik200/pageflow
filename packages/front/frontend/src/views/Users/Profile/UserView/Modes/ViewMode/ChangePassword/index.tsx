import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { UserDetailStorage } from "core/storages/user/userDetail";

import ChangePasswordModal from "./ChangePasswordModal";

function ChangePasswordAction() {
  const { t } = useTranslation("user-profile");
  const { user } = useViewContext().containerInstance.get(UserDetailStorage);
  const [opened, open, close] = useBoolean(false);
  if (!user!.canUpdate) return null;

  return (
    <>
      <Button type="OUTLINE" onClick={open}>
        {t({ scope: "tab_user", place: "edit", name: "change_password_action" })}
      </Button>
      <ChangePasswordModal opened={opened} close={close} />
    </>
  );
}

export default observer(ChangePasswordAction);
