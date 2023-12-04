import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import EditUserFlowModal from "../../Modals/Edit";

function CreateUserFlowAction() {
  const { t } = useTranslation("user-flow");
  const [opened, open, close] = useBoolean(false);
  return (
    <>
      <Button size="SMALL" iconLeft="plusLine" onClick={open}>
        {t({ scope: "actions", place: "add_user_flow", name: "button" })}
      </Button>
      <EditUserFlowModal opened={opened} close={close} />
    </>
  );
}

export default observer(CreateUserFlowAction);
