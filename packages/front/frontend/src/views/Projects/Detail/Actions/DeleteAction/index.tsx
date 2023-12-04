import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import DeleteProjectModal from "./Modal";

interface AdditionalProjectActionInterface {
  project: ProjectDetailEntity;
}

function AdditionalProjectAction({ project }: AdditionalProjectActionInterface) {
  const { t } = useTranslation("project-detail");
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  return (
    <AdditionalActions closeOnClickOutside={!deleteOpened}>
      {project.resultCanEdit && (
        <AdditionalActionButton
          text={t({ scope: "delete_project", place: "action", name: "delete" })}
          onClick={openDelete}
        />
      )}
      <DeleteProjectModal project={project} opened={deleteOpened} close={closeDelete} />
    </AdditionalActions>
  );
}

export default observer(AdditionalProjectAction);
