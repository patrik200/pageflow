import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";

import { UserFlowEntity } from "core/entities/userFlow/userFlow";

import DeleteUserFlowModal from "../../../Modals/Delete";
import EditUserFlowModal from "../../../Modals/Edit";

import { wrapperStyles } from "./style.css";

interface UserFlowCardActionsInterface {
  userFlow: UserFlowEntity;
}

function UserFlowCardActions({ userFlow }: UserFlowCardActionsInterface) {
  const { t } = useTranslation("user-flow");
  const [editOpened, openEdit, closeEdit] = useBoolean(false);
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);

  return (
    <div className={wrapperStyles}>
      <AdditionalActions closeOnClickOutside={!editOpened && !deleteOpened}>
        <AdditionalActionButton
          text={t({ scope: "user_flow_card", place: "actions", name: "edit" })}
          onClick={openEdit}
        />
        <AdditionalActionButton
          text={t({ scope: "user_flow_card", place: "actions", name: "delete" })}
          onClick={openDelete}
        />
        <DeleteUserFlowModal userFlow={userFlow} opened={deleteOpened} close={closeDelete} />
        <EditUserFlowModal userFlow={userFlow} opened={editOpened} close={closeEdit} />
      </AdditionalActions>
    </div>
  );
}

export default observer(UserFlowCardActions);
