import React from "react";
import { observer } from "mobx-react-lite";
import { ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import FormFieldPermissionsList from "components/FormField/PermissionsList";

import { PermissionEntity } from "core/entities/permission/permision";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import { wrapperStyles } from "./style.css";

interface BoardMembersModalContentInterface {
  boardId: string;
}

function BoardMembersModalContent({ boardId }: BoardMembersModalContentInterface) {
  const { t } = useTranslation("tickets");
  const { boards, loadPermissions, createPermission, deletePermission, editPermission } =
    useViewContext().containerInstance.get(TicketBoardsStorage);

  const board = useObservableAsDeferredMemo(
    (boards) => boards.find((board) => board.id === boardId)!,
    [boardId],
    boards,
  );

  React.useEffect(() => void loadPermissions(board.id), [board.id, loadPermissions]);

  const handleCreate = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await createPermission(board.id, entity);
      if (result.success) return true;
      return result.error;
    },
    [board.id, createPermission],
  );

  const handleEdit = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await editPermission(board.id, entity);
      if (result.success) return true;
      return result.error;
    },
    [board.id, editPermission],
  );

  const handleDelete = React.useCallback(
    async (entity: PermissionEntity) => {
      const result = await deletePermission(board.id, entity.user.id);
      if (result.success) return true;
      return result.error;
    },
    [board.id, deletePermission],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "board_members_modal", name: "title" })}</ModalTitle>
      <div className={wrapperStyles}>
        <FormFieldPermissionsList
          permissions={board.permissions}
          isPrivate={board.isPrivate}
          editing
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default observer(BoardMembersModalContent);
