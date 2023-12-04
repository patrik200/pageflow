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

import { DocumentDependenciesStorage } from "core/storages/document/dependencies";
import { CorrespondenceSelectModalStorage } from "core/storages/correspondence/selectModal";

import CreateDependency from "../Actions/CreateDependency";

import { correspondenceTableStyles } from "./styles.css";

function SelectCorrespondencesTable() {
  const { t } = useTranslation("document-dependencies");

  const containerInstance = useViewContext().containerInstance;
  const documentDependenciesStorage = containerInstance.get(DocumentDependenciesStorage);
  const { correspondences } = containerInstance.get(CorrespondenceSelectModalStorage);

  return (
    <Table className={correspondenceTableStyles}>
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
        {correspondences.map(
          (correspondence) =>
            !documentDependenciesStorage.getIsDependent(correspondence.id) && (
              <TableRow key={correspondence.id} href={`/correspondences/${correspondence.id}`}>
                <TableCell>
                  <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
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
                <CreateDependency correspondence={correspondence} />
              </TableRow>
            ),
        )}
      </TableBody>
    </Table>
  );
}

export default observer(SelectCorrespondencesTable);
