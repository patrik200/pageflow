import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { observer } from "mobx-react-lite";
import { GoalStorage } from "core/storages/goal";
import { emitRequestError } from "core/emitRequest";
import { EditGoalEntity } from "core/storages/goal/entities/EditGoal";
import PageWrapper from "../../_PageWrapper";
import CardTitlePreset from "components/Card/pressets/CardTitle";
import Card from "components/Card";
import Edit from "../Detail/Tabs/Main/Edit";
import CardLoadingPreset from "components/Card/pressets/CardLoading";



function EditGoalView() {
    const { query, push } = useRouter()
    
    const { t } = useTranslation("goal-detail");

    const { updateGoal, loadGoal, goalDetail } = useViewContext().containerInstance.get(GoalStorage)
    const [{loading}, asyncUpdateGoal] = useAsyncFn(updateGoal, [updateGoal])
    const [{ loading: loadingGoal }, asyncLoadGoal] = useAsyncFn(loadGoal, [loadGoal], {loading: true})

    const { id } = useRouter().query as {id: string}

    React.useEffect(() => void asyncLoadGoal(id), [asyncLoadGoal])

const handleEditClick = React.useCallback(async () => {
    const entity = EditGoalEntity.buildFromGoal(goalDetail!);

    if (goalDetail) {
        const result = await asyncUpdateGoal(id, entity);
        if (result.success) {
            push.current(`/goals/${id}`);
        } else {
            emitRequestError(
                entity,
                result.error,
                "Туду: Написать перевод блеать"
            );
        }
    }
}, [asyncUpdateGoal, goalDetail, id, push]);

    const entity = React.useMemo(() => loadingGoal ? undefined : EditGoalEntity.buildFromGoal(goalDetail!), [goalDetail, loadingGoal])

    if(loadingGoal) return <PageWrapper title={t({ scope: "meta", name: "create" })}><CardLoadingPreset title={t({ scope: "meta", name: "create" })}/></PageWrapper>

    return <PageWrapper title={t({ scope: "meta", name: "create" })}>
        <CardTitlePreset
            title={t({ scope: "meta", name: "create" })}
            actions={
            <Button iconLeft="plusLine" size="SMALL" loading={loadingGoal} onClick={handleEditClick}>
                {t({ scope: "create_goal", place: "action", name: "create" })}
            </Button>
            }
        />
        <Card>
            <Edit entity={entity!} loading={loading}/>
        </Card>
    </PageWrapper>
}

export default observer(EditGoalView); 
