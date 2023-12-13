import { Modal } from "@app/ui-kit";
import AsyncModalContent from "components/AsyncModalContent";
import { GoalEntity } from "core/entities/goal/goal";
import { observer } from "mobx-react-lite";

interface EditGoalModalInterface {
  opened: boolean;
  goal?: GoalEntity;
  close: () => void;
  onSuccess?: () => void;
}

const ModalContent = () => import("./ModalContent");

function EditGoalModal({ opened, goal, close, onSuccess }: EditGoalModalInterface) {
  return (
    <Modal opened={opened} onClose={close}>
      <AsyncModalContent asyncComponent={ModalContent} goal={goal} close={close} onSuccess={onSuccess} />
    </Modal>
  );
}

export default observer(EditGoalModal);
