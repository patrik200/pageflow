import React from "react"
import { useRouter, useViewContext } from "@app/front-kit"
import { GoalStorage } from "core/storages/goal"
import { observer } from "mobx-react-lite"
import { useAsyncFn } from "@worksolutions/react-utils";
import PageWrapper from "views/_PageWrapper";
import CardTitleTabs from "components/Card/pressets/CardTitleTabs";
import { TabItemInterface } from "@app/ui-kit";
import GoalsMainTab from "./Tabs/Main";
import CardLoadingPreset from "components/Card/pressets/CardLoading";
import GoalActions from "./Tabs/Main/View/Actions";

export type Tab = "main"
function GoalDetailView() {
    const { goalDetail, loadGoal } = useViewContext().containerInstance.get(GoalStorage)
    const { id } = useRouter().query as {id: string}

    const [tab, setTab] = React.useState<Tab>("main");

    const tabs = React.useMemo<TabItemInterface<Tab>[]>(
        () => [
            { code: "main", title: "Основная информация" },
        ],
        [],
    );

    const [{ loading }, asyncLoadGoal] = useAsyncFn(loadGoal, [loadGoal],  {loading: true})

    React.useEffect(() => void asyncLoadGoal(id), [asyncLoadGoal, id])

    if (loading) return <PageWrapper title="ТАйтл"><CardLoadingPreset title="ТАйтл"/></PageWrapper>
    
    return <PageWrapper title="ТАйтл">
        <CardTitleTabs title={goalDetail!.name} items={tabs} active={tab} onChange={setTab} actions={<GoalActions entity={goalDetail!}/>}/>
        {tab === "main" && <GoalsMainTab />}
    </PageWrapper>
}

export default observer(GoalDetailView)