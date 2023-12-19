import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import { StatisticsEntity } from "core/entities/statistics";

import StatisticsCard from "./Card";

import { wrapperStyles } from "./style.css";

interface HomePageStatisticsInterface {
  statistics: StatisticsEntity;
}

function HomePageStatistics({ statistics }: HomePageStatisticsInterface) {
  const { t } = useTranslation("home");
  return (
    <div className={wrapperStyles}>
      <StatisticsCard
        title={t({ scope: "statistics", name: "tickets_where_i_am_an_author" })}
        value={statistics.ticketsWhereIAmAnAuthor}
      />
      <StatisticsCard
        title={t({ scope: "statistics", name: "tickets_where_i_am_a_responsible" })}
        value={statistics.ticketsWhereIAmAnResponsible}
      />
      <StatisticsCard
        title={t({ scope: "statistics", name: "tickets_where_i_am_a_customer" })}
        value={statistics.ticketsWhereIAmAnCustomer}
      />
      <StatisticsCard
        title={t({ scope: "statistics", name: "projects_where_i_am_an_responsible" })}
        value={statistics.projectWhereIAmAnResponsible}
      />
      <StatisticsCard
        title={t({ scope: "statistics", name: "document_revisions_where_i_am_an_responsible" })}
        value={statistics.documentRevisionsWhereIAmAnResponsible}
      />
    </div>
  );
}

export default observer(HomePageStatistics);
