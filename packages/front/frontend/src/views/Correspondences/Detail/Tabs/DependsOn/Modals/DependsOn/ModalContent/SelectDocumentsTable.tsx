import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";

import UserRow from "components/UserRow";

import { CorrespondenceDependenciesStorage } from "core/storages/correspondence/dependencies";
import { DocumentSelectModalStorage } from "core/storages/document/selectModal";

import CreateDependency from "../Actions/CreateDependency";

import { documentTableStyles } from "./styles.css";

function SelectDocumentsTable() {
  const { t } = useTranslation("correspondence-dependencies");

  const containerInstance = useViewContext().containerInstance;
  const correspondenceDependenciesStorage = containerInstance.get(CorrespondenceDependenciesStorage);
  const { documents } = containerInstance.get(DocumentSelectModalStorage);

  return (
    <Table className={documentTableStyles}>
      <TableHead>
        <TableRow>
          <TableHeadCell>{t({ scope: "modals", place: "table", name: "header", parameter: "number" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "modals", place: "table", name: "header", parameter: "author" })}</TableHeadCell>
          <TableHeadCell>
            {t({ scope: "modals", place: "table", name: "header", parameter: "created_at" })}
          </TableHeadCell>
          <TableHeadCell>
            {t({ scope: "modals", place: "table", name: "header", parameter: "updated_at" })}
          </TableHeadCell>
          <TableHeadCell>{null}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {documents.map(
          (document) =>
            !correspondenceDependenciesStorage.getIsDependent(document.id) && (
              <TableRow key={document.id} href={`/correspondences/${document.id}`}>
                <TableCell>
                  <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
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
                <CreateDependency document={document} />
              </TableRow>
            ),
        )}
      </TableBody>
    </Table>
  );
}

export default observer(SelectDocumentsTable);
