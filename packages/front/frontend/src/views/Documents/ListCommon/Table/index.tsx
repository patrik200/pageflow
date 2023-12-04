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
import { DocumentSortingFields } from "@app/shared-enums";

import UserRow from "components/UserRow";
import FolderRow from "components/FolderRow";
import { PrivateIndicatorForTable } from "components/PrivateIndicator";

import { DocumentStorage } from "core/storages/document";

import GroupActions from "./Actions/Group";
import DocumentActions from "./Actions/Document";

function DocumentsTable() {
  const { t } = useTranslation("document-list");
  const documentStorage = useViewContext().containerInstance.get(DocumentStorage);
  const handleGroupClickFabric = useMemoizeCallback(
    (id: string) => () => documentStorage.filter.setParentGroupId(id),
    [documentStorage.filter],
    identity,
  );

  const handleSortingFabric = useMemoizeCallback(
    (field: DocumentSortingFields) => (value: TableHeadCellAvailableOrder) =>
      documentStorage.filter.setSorting(field, value),
    [documentStorage],
    identity,
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell
            order={documentStorage.filter.getSortingForField(DocumentSortingFields.NAME)}
            onChangeOrder={handleSortingFabric(DocumentSortingFields.NAME)}
          >
            {t({ scope: "table", place: "header", name: "name" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "author" })}</TableHeadCell>
          <TableHeadCell
            order={documentStorage.filter.getSortingForField(DocumentSortingFields.CREATED_AT)}
            onChangeOrder={handleSortingFabric(DocumentSortingFields.CREATED_AT)}
          >
            {t({ scope: "table", place: "header", name: "created_at" })}
          </TableHeadCell>
          <TableHeadCell
            order={documentStorage.filter.getSortingForField(DocumentSortingFields.UPDATED_AT)}
            onChangeOrder={handleSortingFabric(DocumentSortingFields.UPDATED_AT)}
          >
            {t({ scope: "table", place: "header", name: "updated_at" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "last_revision_status" })}</TableHeadCell>
          <TableHeadCell>{null}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {documentStorage.groupsAndDocuments.documentGroups.map((group) => (
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
            <TableCell>{null}</TableCell>
            <GroupActions entity={group} />
          </TableRow>
        ))}
        {documentStorage.groupsAndDocuments.documents.map((document) => (
          <TableRow key={document.id} href={`/documents/${document.id}`}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {document.isPrivate && <PrivateIndicatorForTable />}
                {document.name}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                <UserRow user={document.author} />
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {document.viewCreatedAt}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {document.viewUpdatedAt}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {document.lastRevisionStatus === null
                  ? "—"
                  : t({ scope: "common:document_revision_statuses", name: document.lastRevisionStatus })}
              </TableCellDefaultText>
            </TableCell>
            <DocumentActions entity={document} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default observer(DocumentsTable);
