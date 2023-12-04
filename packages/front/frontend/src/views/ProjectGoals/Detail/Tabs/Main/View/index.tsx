import { useTranslation, useViewContext } from "@app/front-kit";
import { GoalStorage } from "core/storages/goal";
import { observer } from "mobx-react-lite";


import FormFieldText from "components/FormField/Text";
import FormFieldUser from "components/FormField/User";
import FormFieldSelect from "components/FormField/Select";
import SimpleTextSelectFieldTrigger from "components/FormField/Select/SimpleTextSelectFieldTrigger";
import FormFieldDate from "components/FormField/Date";
import GroupedContent from "components/FormField/GroupedContent";
import { GoalEntity } from "core/entities/goal/goal";

function MainContent() {
    const { t } = useTranslation("goal-detail");
    const { containerInstance } = useViewContext();
    const { goalDetail }  = containerInstance.get(GoalStorage);

    return (
        <GroupedContent>
            <FormFieldText 
            view
            title={t({ scope: "main_tab", place: "name_field", name: "placeholder" })}
            value={goalDetail!.name}/>
            <FormFieldText
            view 
            title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
            value={goalDetail!.description}/>
        </GroupedContent>
    )
}
export default observer(MainContent)