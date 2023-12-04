import GroupedContent from "components/FormField/GroupedContent";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";

import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import FormFieldText from "components/FormField/Text";

interface GoalDetailMainEditInterface {
    loading: boolean,
    entity: EditGoalEntity
}

function GoalDetailMainEdit({ loading, entity }: GoalDetailMainEditInterface) {
    const { t } = useTranslation("goal-detail");
    return <GroupedContent>
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
    </GroupedContent>
}

export default observer(GoalDetailMainEdit);
