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
import { useAsyncFn } from "@worksolutions/react-utils";

import ActionsTableCell from "components/ActionsTableCell";
import CardTablePreset from "components/Card/pressets/CardTable";
import UserRow from "components/UserRow";

import { DocumentStorage } from "core/storages/document";
import { DocumentDependenciesStorage } from "core/storages/document/dependencies";

import RemoveBackDependency from "./Actions/RemoveBackDependency";

function DocumentDependenciesTable() {
  const { t } = useTranslation("document-dependencies");
  const { containerInstance } = useViewContext();

  const { documentDetail } = containerInstance.get(DocumentStorage);
  const { dependsTo, loadDependsTo } = containerInstance.get(DocumentDependenciesStorage);

  const [{ loading }, asyncLoadDependsTo] = useAsyncFn(loadDependsTo, [loadDependsTo], {
    loading: true,
  });

  React.useEffect(() => void asyncLoadDependsTo(documentDetail!.id), [asyncLoadDependsTo, documentDetail]);

  return (
    <CardTablePreset title={t({ scope: "depends_to_tab", name: "title" })}>
      <Table loading={loading}>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "number" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "author" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "created_at" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "updated_at" })}
            </TableHeadCell>
            <TableHeadCell>{null}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dependsTo.map((correspondence) => (
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
              <ActionsTableCell size="160">
                <RemoveBackDependency correspondence={correspondence} />
              </ActionsTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTablePreset>
  );
}

export default observer(DocumentDependenciesTable);
