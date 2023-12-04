import React from "react";
import { observer } from "mobx-react-lite";
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
import { templateReact, useTranslation, useViewContext } from "@app/front-kit";
import { decimalNumberFormat } from "@app/kit";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { ProjectSortingFields } from "@app/shared-enums";

import UserRow from "components/UserRow";
import { PrivateIndicatorForTable } from "components/PrivateIndicator";
import { InformerIndicatorForTable } from "components/InformerIndicator";
import DaysRemaining from "components/DaysRemaining";
import CompletedTag from "components/Card/pressets/CardTitle/CompletedTag";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import { ProjectsListFiltersEntity } from "core/storages/project/entities/Filter";

import { ProjectStorage } from "core/storages/project";

import ProjectActions from "./ProjectActions";
import ProjectDates from "../../Detail/common/Dates";

interface ProjectsTableInterface {
  filter: ProjectsListFiltersEntity;
}

function ProjectsTable({ filter }: ProjectsTableInterface) {
  const { t, language } = useTranslation("projects");
  const projectStorage = useViewContext().containerInstance.get(ProjectStorage);

  const handleSortingFabric = useMemoizeCallback(
    (field: ProjectSortingFields) => (value: TableHeadCellAvailableOrder) => filter.setSorting(field, value),
    [filter],
    identity,
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell
            order={filter.getSortingForField(ProjectSortingFields.NAME)}
            onChangeOrder={handleSortingFabric(ProjectSortingFields.NAME)}
          >
            {t({ scope: "table", place: "header", name: "name" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(ProjectSortingFields.START_DATE_PLAN)}
            onChangeOrder={handleSortingFabric(ProjectSortingFields.START_DATE_PLAN)}
          >
            {t({ scope: "table", place: "header", name: "dates" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "responsible" })}</TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(ProjectSortingFields.STATUS)}
            onChangeOrder={handleSortingFabric(ProjectSortingFields.STATUS)}
          >
            {t({ scope: "table", place: "header", name: "status" })}
          </TableHeadCell>
          <TableHeadCell position="right">{t({ scope: "table", place: "header", name: "tickets" })}</TableHeadCell>
          <TableHeadCell>{null}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {projectStorage.projects.items.map((project) => (
          <TableRow key={project.id} href={`/projects/${project.id}`}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {project.viewEndDatePlanRemainingWarning !== null && (
                  <InformerIndicatorForTable
                    tooltip={templateReact(
                      t({ scope: "table", place: "body", name: "name", parameter: "plan_remaining_warning" }),
                      {
                        days: <DaysRemaining days={project.viewEndDatePlanRemainingWarning} />,
                      },
                    )}
                  />
                )}
                {project.isPrivate && <PrivateIndicatorForTable />}
                {project.completed && (
                  <CompletedTag text={t({ scope: "table", place: "body", name: "completed_tag" })} mode="success" />
                )}
                {project.archived && <ArchivedTag />}
                {project.name}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText>
                <ProjectDates
                  project={project}
                  fromText={t({ scope: "table", place: "body", name: "dates", parameter: "from" })}
                  toText={t({ scope: "table", place: "body", name: "dates", parameter: "to" })}
                  planText={t({ scope: "table", place: "body", name: "dates", parameter: "plan" })}
                  forecastText={t({ scope: "table", place: "body", name: "dates", parameter: "forecast" })}
                  factText={t({ scope: "table", place: "body", name: "dates", parameter: "fact" })}
                />
              </TableCellDefaultText>
            </TableCell>
            <TableCell>{project.responsible && <UserRow user={project.responsible} />}</TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {t({ scope: "table", place: "body", name: "status", parameter: project.status })}
              </TableCellDefaultText>
            </TableCell>
            <TableCell position="right">
              <TableCellDefaultText>
                {decimalNumberFormat({ language }, project.activeTicketsCount)}
              </TableCellDefaultText>
            </TableCell>
            <ProjectActions entity={project} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default observer(ProjectsTable);
