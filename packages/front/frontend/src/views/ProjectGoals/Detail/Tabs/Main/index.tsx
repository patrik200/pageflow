import { GoalEntity } from "core/entities/goal/goal";
import MainContent from "./View";
import Card from "components/Card";
import { observer } from "mobx-react-lite";

function GoalsMainTab() {
    return <Card><MainContent /></Card>;
}

export default observer(GoalsMainTab)