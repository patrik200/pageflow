import React from "react";
import { observer } from "mobx-react-lite";
import { templateReact, useTranslation, useViewContext } from "@app/front-kit";
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
import { useAsyncFn, useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { DocumentRevisionSortingFields } from "@app/shared-enums";

import CardTablePreset from "components/Card/pressets/CardTable";
import UserRow from "components/UserRow";
import { InformerIndicatorForTable } from "components/InformerIndicator";
import DaysRemaining from "components/DaysRemaining";

import { DocumentRevisionFilterEntity } from "core/storages/document/entities/revision/DocumentRevisionFilter";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import DocumentRevisionsActions from "./Actions";
import DocumentRevisionActions from "./RevisionActions";

function DocumentRevisionsCard() {
  const { t } = useTranslation("document-detail");
  const { containerInstance } = useViewContext();
  const { revisions, loadRevisions } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);
  const [{ loading }, asyncLoadRevisions] = useAsyncFn(loadRevisions, [loadRevisions], { loading: true });

  const entity = React.useMemo(() => DocumentRevisionFilterEntity.buildEmpty(documentDetail!.id), [documentDetail]);

  React.useEffect(() => {
    void asyncLoadRevisions(entity);
    return entity.subscribeOnChange(() => asyncLoadRevisions(entity));
  }, [asyncLoadRevisions, entity]);

  const handleSortingFabric = useMemoizeCallback(
    (field: DocumentRevisionSortingFields) => (value: TableHeadCellAvailableOrder) => entity.setSorting(field, value),
    [entity],
    identity,
  );

  return (
    <CardTablePreset
      title={t({ scope: "main_tab_revisions", name: "title" })}
      actions={<DocumentRevisionsActions filter={entity} />}
    >
      <Table loading={loading}>
        <TableHead>
          <TableRow>
            <TableHeadCell
              order={entity.getSortingForField(DocumentRevisionSortingFields.NUMBER)}
              onChangeOrder={handleSortingFabric(DocumentRevisionSortingFields.NUMBER)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "number" })}
            </TableHeadCell>
            <TableHeadCell
              order={entity.getSortingForField(DocumentRevisionSortingFields.CREATED_AT)}
              onChangeOrder={handleSortingFabric(DocumentRevisionSortingFields.CREATED_AT)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "created_at" })}
            </TableHeadCell>
            <TableHeadCell
              order={entity.getSortingForField(DocumentRevisionSortingFields.STATUS)}
              onChangeOrder={handleSortingFabric(DocumentRevisionSortingFields.STATUS)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "status" })}
            </TableHeadCell>
            <TableHeadCell
              order={entity.getSortingForField(DocumentRevisionSortingFields.AUTHOR)}
              onChangeOrder={handleSortingFabric(DocumentRevisionSortingFields.AUTHOR)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "author" })}
            </TableHeadCell>
            <TableHeadCell>{null}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {revisions.map((revision) => (
            <TableRow key={revision.id} href={`/document-revisions/${revision.id}`}>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {revision.approvingDeadlineRemainingDays !== null && (
                    <InformerIndicatorForTable
                      tooltip={templateReact(
                        t({
                          scope: "main_tab_revisions",
                          place: "table",
                          name: "body",
                          parameter: "name_plan_remaining_warning",
                        }),
                        {
                          days: <DaysRemaining days={revision.approvingDeadlineRemainingDays} />,
                        },
                      )}
                    />
                  )}
                  {revision.number}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {revision.viewCreatedAt}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {t({ scope: "common:document_revision_statuses", name: revision.status })}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  <UserRow user={revision.author} />
                </TableCellDefaultText>
              </TableCell>
              <DocumentRevisionActions revision={revision} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTablePreset>
  );
}

export default observer(DocumentRevisionsCard);
