import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";
import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ActionsTableCell from "components/ActionsTableCell";

import DeleteDocumentGroupModal from "views/Documents/Modals/DeleteGroup";
import EditDocumentGroupModal from "views/Documents/Modals/EditGroup";
import MoveDocumentGroupModal from "views/Documents/Modals/MoveGroup";
import DocumentGroupPermissionsModal from "views/Documents/Modals/PermissionsGroup";

import { DocumentGroupEntity } from "core/entities/document/group";

import { DocumentStorage } from "core/storages/document";

interface GroupActionsInterface {
  entity: DocumentGroupEntity;
}

function GroupActions({ entity }: GroupActionsInterface) {
  const { t } = useTranslation("document-list");
  const [moveOpened, openMove, closeMove] = useBoolean(false);
  const [permissionsOpened, openPermissions, closePermissions] = useBoolean(false);
  const [editOpened, openEdit, closeEdit] = useBoolean(false);
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);

  const { filter, loadGroupsAndDocuments, setGroupFavourite } = useViewContext().containerInstance.get(DocumentStorage);

  const handleReload = React.useCallback(() => loadGroupsAndDocuments(), [loadGroupsAndDocuments]);
  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setGroupFavourite(entity.id, favourite),
    [entity.id, setGroupFavourite],
  );

  return (
    <ActionsTableCell size="160">
      <AdditionalActionFavourite favourite={entity.favourite} onChange={handleSetFavourite} />
      <AdditionalActions closeOnClickOutside={!moveOpened && !permissionsOpened && !editOpened && !deleteOpened}>
        {entity.resultCanEdit && (
          <>
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "edit" })}
              onClick={openEdit}
            />
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "permissions" })}
              onClick={openPermissions}
            />
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "move" })}
              onClick={openMove}
            />
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "delete" })}
              onClick={openDelete}
            />
          </>
        )}
        <MoveDocumentGroupModal
          opened={moveOpened}
          initialFilter={filter}
          group={entity}
          close={closeMove}
          onSuccess={handleReload}
        />
        <DeleteDocumentGroupModal opened={deleteOpened} group={entity} close={closeDelete} onSuccess={handleReload} />
        <EditDocumentGroupModal opened={editOpened} group={entity} close={closeEdit} onSuccess={handleReload} />
        <DocumentGroupPermissionsModal opened={permissionsOpened} entity={entity} close={closePermissions} />
      </AdditionalActions>
    </ActionsTableCell>
  );
}

export default observer(GroupActions);
