import React from "react";
import { observer } from "mobx-react-lite";
import { nbspString, template } from "@worksolutions/utils";
import cn from "classnames";

import DaysRemaining from "components/DaysRemaining";
import { FormFieldTextEmptyView } from "components/FormField/Text";

import { ProjectEntity } from "core/entities/project/project";

import { dateRowStyles } from "./style.css";

interface ProjectDatesInterface {
  project: ProjectEntity;
  planText: string;
  forecastText: string;
  factText: string;
  fromText: string;
  toText: string;
}

function ProjectDates({ project, planText, forecastText, factText, fromText, toText }: ProjectDatesInterface) {
  if (
    !project.viewStartDatePlan &&
    !project.viewStartDateForecast &&
    !project.viewStartDateFact &&
    !project.viewEndDatePlan &&
    !project.viewEndDateForecast &&
    !project.viewEndDateFact
  ) {
    return <FormFieldTextEmptyView />;
  }

  return (
    <>
      <RenderDate
        baseText={planText}
        fromText={fromText}
        toText={toText}
        startDate={project.viewStartDatePlan}
        endDate={project.viewEndDatePlan}
        endDateRemaining={project.viewEndDatePlanRemaining}
      />
      <RenderDate
        baseText={forecastText}
        fromText={fromText}
        toText={toText}
        startDate={project.viewStartDateForecast}
        endDate={project.viewEndDateForecast}
        endDateRemaining={project.viewEndDateForecastRemaining}
      />
      <RenderDate
        baseText={factText}
        fromText={fromText}
        toText={toText}
        startDate={project.viewStartDateFact}
        endDate={project.viewEndDateFact}
        endDateRemaining={project.viewEndDateFactRemaining}
      />
    </>
  );
}

export default observer(ProjectDates);

function RenderDate({
  baseText,
  fromText,
  toText,
  startDate,
  endDate,
  endDateRemaining,
}: {
  baseText: string;
  fromText: string;
  toText: string;
  startDate: string | null;
  endDate: string | null;
  endDateRemaining: number | null;
}) {
  if (!startDate && !endDate) return null;

  return (
    <div className={cn(dateRowStyles)}>
      <span>{baseText}</span>
      <span>{startDate && template(fromText, { date: startDate }).replaceAll(" ", nbspString)}</span>
      {endDate && (
        <>
          <span>
            {template(toText, { date: endDate }).replaceAll(" ", nbspString)}
            {endDateRemaining !== null && (
              <>
                {nbspString}(<DaysRemaining days={endDateRemaining} />)
              </>
            )}
          </span>
        </>
      )}
    </div>
  );
}
