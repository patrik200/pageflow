import { useTranslation } from "@app/front-kit";
import { observer } from "mobx-react-lite";

import Detail from "views/ProjectGoals/Detail";

import { GoalEntity } from "core/entities/goal/goal";

// interface GoalsTableInterface {
//    goals: GoalEntity[];
//}

function GoalsTable() {
    const list = [
        {
            id: 1,
            name: "Goal 1",
            description: "Goal 1 description",
            timepoints: [
                {
                    id: 1,
                    name: "fuck",
                    description: "f",
                },
                {
                    id: 2,
                    name: "fuck",
                    description: "f",
                },
            ],
        },
    ];

    return (
        <div>
            {list.map((goal, index) => (
                <Detail key={index} goal={goal} />
            ))}
        </div>
    );
}

export default observer(GoalsTable);
