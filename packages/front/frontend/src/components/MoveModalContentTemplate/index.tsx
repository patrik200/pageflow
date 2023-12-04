import React from "react";
import { observer } from "mobx-react-lite";
import { Button, ModalTitle, Table, TableBody } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import cn from "classnames";

import Breadcrumbs, { BreadcrumbInterface } from "components/Breadcrumbs";

import RowGroup from "./RowGroup";

import { moveHereButtonWrapperStyles, moveHereButtonWrapperVisibleStyles, wrapperStyles } from "./style.css";

export type MoveModalContentTemplateGroup = { name: string; id: string };

export type MoveModalContentTemplateBreadcrumb = { name: string; id: string | null };

interface MoveModalContentTemplateInterface {
  title: string;
  initialGroupId: string | null;
  currentGroupId: string | null;
  groups: MoveModalContentTemplateGroup[];
  changeFolderLoading: boolean;
  moveLoading: boolean;
  breadcrumbs: MoveModalContentTemplateBreadcrumb[];
  onMove: (groupId: string | null) => void;
  onChangeGroup: (groupId: string | null) => void;
}

function MoveModalContentTemplate({
  title,
  initialGroupId,
  currentGroupId,
  groups,
  changeFolderLoading,
  moveLoading,
  breadcrumbs,
  onMove,
  onChangeGroup,
}: MoveModalContentTemplateInterface) {
  const { t } = useTranslation();

  const handleMoveHereClickFabric = useMemoizeCallback(
    (targetGroupId: string | null) => () => onMove(targetGroupId),
    [onMove],
    identity,
  );

  const handleRowClickFabric = useMemoizeCallback(
    (groupId: string) => () => onChangeGroup(groupId),
    [onChangeGroup],
    identity,
  );

  const resultBreadcrumbs = React.useMemo<BreadcrumbInterface[]>(
    () => breadcrumbs.map(({ name, id }) => ({ text: name, onClick: () => onChangeGroup(id) })),
    [breadcrumbs, onChangeGroup],
  );

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{title}</ModalTitle>
      <Breadcrumbs items={resultBreadcrumbs} disabled={moveLoading || changeFolderLoading} />
      <Table loading={moveLoading || changeFolderLoading}>
        <TableBody>
          {groups.map(({ id, name }) => (
            <RowGroup key={id} name={name} onClick={handleRowClickFabric(id)} />
          ))}
        </TableBody>
      </Table>
      <div
        className={cn(
          moveHereButtonWrapperStyles,
          currentGroupId !== initialGroupId && moveHereButtonWrapperVisibleStyles,
        )}
      >
        <Button size="SMALL" loading={moveLoading} onClick={handleMoveHereClickFabric(currentGroupId)}>
          {t({ scope: "move_modal", name: "move_here_button" })}
        </Button>
      </div>
    </div>
  );
}

export default observer(MoveModalContentTemplate);
