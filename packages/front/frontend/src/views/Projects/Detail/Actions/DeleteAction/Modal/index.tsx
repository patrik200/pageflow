import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "@app/ui-kit";

import AsyncModalContent from "components/AsyncModalContent";

import { ProjectEntity } from "core/entities/project/project";

interface ProjectDeleteModalInterface {
  project: ProjectEntity;
  opened: boolean;
  close: () => void;
}

const ModalContent = () => import("./ModalContent");

function ProjectDeleteModal({ opened, project, close }: ProjectDeleteModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} project={project} />
    </Modal>
  );
}

export default observer(ProjectDeleteModal);
