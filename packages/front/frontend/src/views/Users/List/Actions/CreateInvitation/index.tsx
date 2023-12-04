import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import CreateInvitationModal from "../../Modals/CreateInvitation";

function CreateInvitationAction() {
  const { t } = useTranslation("users-list");
  const [isModalOpened, openModal, closeModal] = useBoolean(false);

  return (
    <>
      <Button size="SMALL" iconLeft="shareLine" onClick={openModal}>
        {t({ scope: "actions", place: "share_invite", name: "button" })}
      </Button>
      <CreateInvitationModal opened={isModalOpened} onClose={closeModal} />
    </>
  );
}

export default observer(CreateInvitationAction);
