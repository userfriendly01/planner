import React, { createContext, useEffect, useRef, useState } from "react";
import ActionDataGridComponent, { ActionModalType } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Component";
import { useAdminState } from "context/appContext";
import ModalController, { MODAL_NOT_IN_USE } from "dynamicCallFlowCommon/Modal.Controller";
import { DynamicCallFlowContextStore } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";

export const DynamicCallFlowActionContext = createContext<DynamicCallFlowContextStore<ActionModalType> | undefined>(undefined);

const DynamicCallFlowActionContainer = (): JSX.Element => {
  const {
    userContext: {
      permissions,
      tokens: {
        sharedGraph
      }
    }
  } = useAdminState();

  const modalController = useRef<ModalController<ActionModalType>>(new ModalController<ActionModalType>());
  const [currentOpenModal, setCurrentOpenModal] = useState<ActionModalType>(MODAL_NOT_IN_USE);

  const openModal = (modalType: ActionModalType) => {
    setCurrentOpenModal(modalType);
  };

  const closeModal = () => {
    setCurrentOpenModal(MODAL_NOT_IN_USE);
  };

  useEffect(() => {
    modalController.current.setOpenModalRef(openModal);
    modalController.current.setCloseModalRef(closeModal);
  }, [currentOpenModal]);

  return (
    <DynamicCallFlowActionContext.Provider value={ {
      accessTokenGraph: sharedGraph,
      permissions,
      currentOpenModal,
      modalController
    } }>
      <ActionDataGridComponent />
    </DynamicCallFlowActionContext.Provider>
  );
};

export default DynamicCallFlowActionContainer;