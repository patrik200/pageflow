import React from "react";
import { observer } from "mobx-react-lite";
import { identity } from "@worksolutions/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableHeadCellAvailableOrder,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { CorrespondenceSortingFields } from "@app/shared-enums";

import UserRow from "components/UserRow";
import FolderRow from "components/FolderRow";
import { PrivateIndicatorForTable } from "components/PrivateIndicator";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import { CorrespondenceStorage } from "core/storages/correspondence";

import GroupActions from "./Actions/Group";
import CorrespondenceActions from "./Actions/Correspondence";

function CorrespondencesTable() {
  const { t } = useTranslation("correspondence-list");
  const correspondenceStorage = useViewContext().containerInstance.get(CorrespondenceStorage);
  const handleGroupClickFabric = useMemoizeCallback(
    (id: string) => () => correspondenceStorage.filter.setParentGroupId(id),
    [correspondenceStorage.filter],
    identity,
  );

  const handleSortingFabric = useMemoizeCallback(
    (field: CorrespondenceSortingFields) => (value: TableHeadCellAvailableOrder) =>
      correspondenceStorage.filter.setSorting(field, value),
    [correspondenceStorage],
    identity,
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell
            order={correspondenceStorage.filter.getSortingForField(CorrespondenceSortingFields.NAME)}
            onChangeOrder={handleSortingFabric(CorrespondenceSortingFields.NAME)}
          >
            {t({ scope: "table", place: "header", name: "name" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "author" })}</TableHeadCell>
          <TableHeadCell
            order={correspondenceStorage.filter.getSortingForField(CorrespondenceSortingFields.CREATED_AT)}
            onChangeOrder={handleSortingFabric(CorrespondenceSortingFields.CREATED_AT)}
          >
            {t({ scope: "table", place: "header", name: "created_at" })}
          </TableHeadCell>
          <TableHeadCell
            order={correspondenceStorage.filter.getSortingForField(CorrespondenceSortingFields.UPDATED_AT)}
            onChangeOrder={handleSortingFabric(CorrespondenceSortingFields.UPDATED_AT)}
          >
            {t({ scope: "table", place: "header", name: "updated_at" })}
          </TableHeadCell>
          <TableHeadCell>{null}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {correspondenceStorage.groupsAndCorrespondences.correspondenceGroups.map((group) => (
          <TableRow key={group.id} hoverable onClick={handleGroupClickFabric(group.id)}>
            <TableCell>
              <FolderRow
                textClassName={typographyOptionalStyleVariants.noWrap}
                beforeFolderIcon={group.isPrivate && <PrivateIndicatorForTable />}
                title={group.name}
              />
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                <UserRow user={group.author} />
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {group.viewCreatedAt}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {group.viewUpdatedAt}
              </TableCellDefaultText>
            </TableCell>
            <GroupActions entity={group} />
          </TableRow>
        ))}
        {correspondenceStorage.groupsAndCorrespondences.correspondences.map((correspondence) => (
          <TableRow key={correspondence.id} href={`/correspondences/${correspondence.id}`}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {correspondence.isPrivate && <PrivateIndicatorForTable />}
                {correspondence.archived && <ArchivedTag />}
                {correspondence.name}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                <UserRow user={correspondence.author} />
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {correspondence.viewCreatedAt}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {correspondence.viewUpdatedAt}
              </TableCellDefaultText>
            </TableCell>
            <CorrespondenceActions entity={correspondence} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default observer(CorrespondencesTable);
