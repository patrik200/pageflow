import React from "react"
import { useViewContext } from "@app/front-kit";
import { GoalStorage } from "core/storages/goal";
import { observer } from "mobx-react-lite";
import { GoalEntity } from "core/entities/goal/goal";
import { Link } from "components/Link";
import { Button } from "@app/ui-kit";

interface EditGoalActionInterface {
    entity: GoalEntity;
}

function EditGoalAction({ entity }: EditGoalActionInterface) {
    return <Link href={`/goals/${entity.id}/edit`}><Button preventDefault={false} size="SMALL">Edit</Button></Link>;
}

export default observer(EditGoalAction);