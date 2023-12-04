import React from "react";
import { useBoolean } from "@worksolutions/react-utils";

import {
  Button,
  Icon,
  Modal,
  ModalActions,
  ModalTitle,
  PopupComponent,
  PopupManager,
  PopupManagerMode,
  SelectField,
  TextField,
  Tooltip,
} from "main";

import { commentStyles, wrapperStyles } from "./style.css";

export function ModalDemo() {
  const [modal1Opened, openModal1, closeModal1] = useBoolean(false);
  const [modal2Opened, openModal2, closeModal2] = useBoolean(false);
  const [modal3Opened, openModal3, closeModal3] = useBoolean(false);
  const [sub1Modal3Opened, openSub1Modal3, closeSub1Modal3] = useBoolean(false);
  const [sub2Modal3Opened, openSub2Modal3, closeSub2Modal3] = useBoolean(false);

  const modalContent = (
    <>
      <ModalTitle>RUN FOREST</ModalTitle>
      <div>
        <TextField
          className={commentStyles}
          informer={
            <Tooltip
              triggerElement={<Icon icon="informationLine" />}
              mode={PopupManagerMode.HOVER}
              primaryPlacement="top-start"
              showDelay={0}
              strategy="absolute"
              offset={[-20, 12]}
              popupElement={<ModalTitle>TOOLTIP</ModalTitle>}
            />
          }
          placeholder="Comment"
          value=""
        />
        <SelectField
          label="label"
          strategy="fixed"
          placeholder="none"
          value={null}
          options={[
            { value: null, label: "Clear", secondaryLabel: "None" },
            { value: "", label: "All", secondaryLabel: "Haha" },
          ]}
          onChange={console.log}
        />
      </div>
      <ModalActions
        primaryActionText="Save"
        primaryActionVariant="PRIMARY"
        primaryActionLoading
        secondaryActionText="Cancel"
        secondaryActionVariant="OUTLINE"
        fitActionSizes
      />
    </>
  );

  return (
    <div className={wrapperStyles}>
      <Button onClick={openModal1}>Default modal</Button>
      <Modal opened={modal1Opened} onClose={closeModal1}>
        {modalContent}
      </Modal>
      <PopupManager
        primaryPlacement="bottom"
        strategy="fixed"
        closeOnClickOutside={!modal2Opened}
        popupElement={
          <PopupComponent>
            <div style={{ padding: 8, background: "white" }}>
              <Button type="OUTLINE" onClick={openModal2}>
                Open modal
              </Button>
              <Modal opened={modal2Opened} onClose={closeModal2}>
                {modalContent}
              </Modal>
            </div>
          </PopupComponent>
        }
        triggerElement={<Button>Open popup</Button>}
        mode={PopupManagerMode.CLICK}
      />
      <Button noWrap onClick={openModal3}>
        Open modal with sub modals
      </Button>
      <Modal opened={modal3Opened} onClose={closeModal3}>
        <Button noWrap onClick={openSub1Modal3}>
          Open modal with sub modals 2
        </Button>
        <Modal opened={sub1Modal3Opened} onClose={closeSub1Modal3}>
          <Button noWrap onClick={openSub2Modal3}>
            Open modal with sub modals 3
          </Button>
          <Modal opened={sub2Modal3Opened} onClose={closeSub2Modal3}>
            {modalContent}
          </Modal>
        </Modal>
      </Modal>
    </div>
  );
}
