import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText, { FormFieldTextItemRight } from "components/FormField/Text";
import FormFieldImage from "components/FormField/Image";
import FormFieldDate from "components/FormField/Date";
import FormFieldCheckbox from "components/FormField/Checkbox";
import FormFieldWrapper from "components/FormField/Wrapper";

import { createIntMask } from "core/defaultMask";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

interface EditMainFormInterface {
  loading: boolean;
  entity: EditProjectEntity;
}

function EditMainForm({ loading, entity }: EditMainFormInterface) {
  const { t } = useTranslation("project-detail");

  return (
    <GroupedContent>
      <FormFieldCheckbox
        edit
        disabled={loading}
        title={t({ scope: "main_tab", place: "private_field", name: "placeholder" })}
        placeholder={t({ scope: "main_tab", place: "private_field", name: "checkbox_placeholder" })}
        value={entity.isPrivate}
        onChange={entity.setIsPrivate}
      />
      <FormFieldText
        edit
        disabled={loading}
        required
        title={t({ scope: "main_tab", place: "name_field", name: "placeholder" })}
        value={entity.name}
        errorMessage={entity.viewErrors.name}
        onChange={entity.setName}
      />
      <FormFieldText
        edit
        disabled={loading}
        rows={5}
        title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
        value={entity.description}
        errorMessage={entity.viewErrors.description}
        onChange={entity.setDescription}
      />
      <FormFieldImage
        edit
        disabled={loading}
        title={t({ scope: "main_tab", place: "preview_field", name: "placeholder" })}
        value={entity.preview}
        errorMessage={entity.viewErrors.preview}
        onChange={entity.setPreview}
      />
      <FormFieldText
        edit
        fieldItemRight={
          entity.notifyInDays === "" ? undefined : (
            <FormFieldTextItemRight
              text={t({ scope: "common:time", name: "days_pure" }, { count: parseInt(entity.notifyInDays) })}
            />
          )
        }
        disabled={loading}
        mask={createIntMask(3)}
        title={t({ scope: "main_tab", place: "notify_in_field", name: "placeholder" })}
        value={entity.notifyInDays}
        errorMessage={entity.viewErrors.notifyInDays}
        onChange={entity.setNotifyInDays}
      />
      <FormFieldWrapper title={t({ scope: "main_tab", place: "date_plan_field", name: "placeholder" })} mode="edit">
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_plan_field", name: "from_placeholder" })}
          disabled={loading}
          value={entity.startDatePlan}
          errorMessage={entity.viewErrors.startDatePlan}
          onChange={entity.setStartDatePlan}
        />
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_plan_field", name: "to_placeholder" })}
          disabled={loading}
          value={entity.endDatePlan}
          minValue={entity.startDatePlan}
          errorMessage={entity.viewErrors.endDatePlan}
          onChange={entity.setEndDatePlan}
        />
      </FormFieldWrapper>
      <FormFieldWrapper title={t({ scope: "main_tab", place: "date_forecast_field", name: "placeholder" })} mode="edit">
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_forecast_field", name: "from_placeholder" })}
          disabled={loading}
          value={entity.startDateForecast}
          errorMessage={entity.viewErrors.startDateForecast}
          onChange={entity.setStartDateForecast}
        />
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_forecast_field", name: "to_placeholder" })}
          disabled={loading}
          value={entity.endDateForecast}
          minValue={entity.startDateForecast}
          errorMessage={entity.viewErrors.endDateForecast}
          onChange={entity.setEndDateForecast}
        />
      </FormFieldWrapper>
      <FormFieldWrapper title={t({ scope: "main_tab", place: "date_fact_field", name: "placeholder" })} mode="edit">
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_fact_field", name: "from_placeholder" })}
          disabled={loading}
          value={entity.startDateFact}
          errorMessage={entity.viewErrors.startDateFact}
          onChange={entity.setStartDateFact}
        />
        <FormFieldDate
          edit
          materialPlaceholder
          placeholder={t({ scope: "main_tab", place: "date_fact_field", name: "to_placeholder" })}
          disabled={loading}
          value={entity.endDateFact}
          minValue={entity.startDateFact}
          errorMessage={entity.viewErrors.endDateFact}
          onChange={entity.setEndDateFact}
        />
      </FormFieldWrapper>
    </GroupedContent>
  );
}

export default observer(EditMainForm);
