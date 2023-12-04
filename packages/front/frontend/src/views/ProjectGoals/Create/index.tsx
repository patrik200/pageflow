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

function CreateGoalView() {
    const { query, push } = useRouter()
    
    const { t } = useTranslation("goal-detail");

    const { createGoal } = useViewContext().containerInstance.get(GoalStorage)
    const [{loading}, asyncCreateGoal] = useAsyncFn(createGoal, [createGoal])

    const handleCreateClick = React.useCallback(async () =>  {
        const result = await asyncCreateGoal(entity)
        if (result.success) {
            push.current(`/goals/${result.id}`)
            return 
        }

        emitRequestError(
            entity,
            result.error,
            "Туду: Написать перевод блеать"
        )
    }, [])

    const entity = React.useMemo(() => EditGoalEntity.buildEmpty(query.project as string), [])

    return <PageWrapper title={t({ scope: "meta", name: "create" })}>
        <CardTitlePreset
            title={t({ scope: "meta", name: "create" })}
            actions={
            <Button iconLeft="plusLine" size="SMALL" loading={loading} onClick={handleCreateClick}>
                {t({ scope: "create_goal", place: "action", name: "create" })}
            </Button>
            }
        />
        <Card>
            <Edit entity={entity} loading={loading}/>
        </Card>
    </PageWrapper>
}

export default observer(CreateGoalView); 
