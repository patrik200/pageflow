import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Badge, BadgeColorVariants, Typography } from "@app/ui-kit";

import Card from "components/Card";
import NameAndImageRow from "components/NameAndImageRow";

import { ProjectEntity } from "core/entities/project/project";

import { ProjectStorage } from "core/storages/project";

import { projectListItemStyles, projectListItemRowStyles, projectListStyles } from "./styles.css";

function ProjectListItem({ project }: { project: ProjectEntity }) {
  const { push } = useRouter();
  const { t } = useTranslation("projects");

  const user = project.responsible ? project.responsible : project.author;

  const handleClick = React.useCallback(() => push.current(`/projects/${project.id}`), [project.id, push]);

  return (
    <Card className={projectListItemStyles} onClick={handleClick}>
      <div className={projectListItemRowStyles}>
        <Typography as="h3">{project.name}</Typography>
        <Badge
          icon="timeLine"
          variant={BadgeColorVariants.INFO}
          text={t({ scope: "table", place: "body", name: "status", parameter: project.status })}
        />
      </div>
      {project.description && <Typography>{project.description}</Typography>}

      <div className={projectListItemRowStyles}>
        <NameAndImageRow name={user.name} image={user.avatar} />
        {project.endDatePlan && (
          <Typography as="span">
            до {project.viewEndDatePlan} (осталось {project.viewEndDatePlanRemaining})
          </Typography>
        )}
      </div>
    </Card>
  );
}

function ProjectList() {
  const projectStorage = useViewContext().containerInstance.get(ProjectStorage);

  const { projects } = projectStorage;

  return (
    <div className={projectListStyles}>
      {projects.items.map((project) => (
        <ProjectListItem project={project} key={project.id} />
      ))}
    </div>
  );
}

export default observer(ProjectList);
