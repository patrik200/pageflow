import { useTranslation } from "@app/front-kit";
import { observer } from "mobx-react-lite";

import Detail from "views/ProjectGoals/Detail";

import { useBoolean } from "@worksolutions/react-utils";

import { GoalEntity } from "core/entities/goal/goal";
import { Button } from "@app/ui-kit";
import EditGoal from "views/ProjectGoals/Modals/EditGoal";

interface GoalsTableInterface {
    goals: GoalEntity[];
}

function GoalsTable({ goals }: GoalsTableInterface) {
    const [opened, onOpen, onClose] = useBoolean(false);

    return (
        <div>
            {goals.map((goal, index) => (
                <Detail key={index} goal={goal} />
            ))}
            <Button size="SMALL" iconLeft="plusLine" type="OUTLINE" onClick={onOpen}>
                Добавить цель
            </Button>
            <EditGoal opened={opened} close={onClose} />
        </div>
    );
}

export default observer(GoalsTable);
