import { Modal } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import AsyncModalContent from "components/AsyncModalContent";

import { TimepointEntity } from "core/entities/goal/timepoint";

interface EditTimepointModalInterface {
  goalId?: string;
  opened: boolean;
  timepoint?: TimepointEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function EditTimepointModal({ opened, timepoint, goalId, close, onSuccess }: EditTimepointModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent
        asyncComponent={ModalContent}
        timepoint={timepoint}
        goalId={goalId}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default observer(EditTimepointModal);
