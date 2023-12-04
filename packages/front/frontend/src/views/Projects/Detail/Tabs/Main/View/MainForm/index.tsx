import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { Typography } from "@app/ui-kit";

import FormFieldText, { valueStyles } from "components/FormField/Text";
import FormFieldImage from "components/FormField/Image";
import FormFieldWrapper from "components/FormField/Wrapper";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import ProjectDates from "../../../../common/Dates";

interface ViewMainFormInterface {
  project: ProjectDetailEntity;
}

function ViewMainForm({ project }: ViewMainFormInterface) {
  const { t } = useTranslation("project-detail");

  return (
    <>
      <FormFieldText
        view
        title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
        value={project.description}
      />
      {project.updateCount !== 0 && (
        <FormFieldText
          view
          title={t({ scope: "main_tab", place: "update_count_field", name: "placeholder" })}
          value={project.updateCount.toString()}
        />
      )}
      <FormFieldImage
        view
        title={t({ scope: "main_tab", place: "preview_field", name: "placeholder" })}
        value={project.preview}
      />
      <FormFieldText
        view
        title={t({ scope: "main_tab", place: "status_field", name: "title" })}
        value={t({ scope: "main_tab", place: "status_field", name: "statuses", parameter: project.status })}
      />
      <FormFieldWrapper title={t({ scope: "main_tab", name: "dates", parameter: "title" })} mode="view">
        <Typography className={valueStyles}>
          <ProjectDates
            project={project}
            fromText={t({ scope: "main_tab", name: "dates", parameter: "from" })}
            toText={t({ scope: "main_tab", name: "dates", parameter: "to" })}
            planText={t({ scope: "main_tab", name: "dates", parameter: "plan" })}
            forecastText={t({ scope: "main_tab", name: "dates", parameter: "forecast" })}
            factText={t({ scope: "main_tab", name: "dates", parameter: "fact" })}
          />
        </Typography>
      </FormFieldWrapper>
      {project.notifyInDays !== null && (
        <FormFieldText
          view
          title={t({ scope: "main_tab", place: "notify_in_field", name: "placeholder" })}
          value={`\
${t({ scope: "common:time", name: "days" }, { count: project.notifyInDays })}\
${
  project.endDatePlan === null
    ? " (" + t({ scope: "main_tab", place: "notify_in_field", name: "not_work_without_end_plan_date" }) + ")"
    : ""
}`}
        />
      )}
    </>
  );
}

export default observer(ViewMainForm);
