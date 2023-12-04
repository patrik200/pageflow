import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import ViewMainForm from "./MainForm";
import ViewAdditionalForm from "./AdditionalForm";
import ChangeFeedEvents from "./ChangeFeedEvents";

import { additionalWrapperStyles, mainWrapperStyles, wrapperStyles } from "./style.css";

interface ProjectDetailMainViewInterface {
  project: ProjectDetailEntity;
}

function ProjectDetailMainView({ project }: ProjectDetailMainViewInterface) {
  return (
    <div className={wrapperStyles}>
      <div className={mainWrapperStyles}>
        <Card>
          <GroupedContent>
            <ViewMainForm project={project} />
          </GroupedContent>
        </Card>
        <Card>
          {project.changeFeedEvents.map((event, key) => (
            <ChangeFeedEvents key={key} event={event} />
          ))}
        </Card>
      </div>
      <div className={additionalWrapperStyles}>
        <Card>
          <GroupedContent>
            <ViewAdditionalForm project={project} />
          </GroupedContent>
        </Card>
      </div>
    </div>
  );
}

export default observer(ProjectDetailMainView);
