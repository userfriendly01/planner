import React, {
  createContext, useEffect, useRef, useState
} from "react";
import ActionDataGridComponent, { ActionModalType } from "./DataGrid/Action.DataGrid.Component";
import { useAccessToken } from "authentication";
import {
  LoginInProgress,
  LoginError
} from "components";
import {
  DynamicCallFlowContextStore
} from "../common/DynamicCallFlowContextStore";
import {
  MODAL_NOT_IN_USE, ModalController
} from "../common/Modal.Controller";

export const DynamicCallFlowActionContext = createContext<DynamicCallFlowContextStore<ActionModalType> | undefined>(undefined);

export interface ActionTokenInfo {
  accessToken: string;
  matchedGroups: string[];
}


const DynamicCallFlowActionContainer = (): JSX.Element => {
  const {
    accessToken,
    matchedGroups,
    isLoading,
    error
  } = useAccessToken();

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

  if (isLoading) {
    return <LoginInProgress />;
  }

  if (error) {
    return <LoginError message={error} />;
  }

  return (
    <DynamicCallFlowActionContext.Provider value={ {
      accessToken,
      matchedGroups,
      currentOpenModal,
      modalController
    } }>
      <ActionDataGridComponent />
    </DynamicCallFlowActionContext.Provider>
  );
};

export default DynamicCallFlowActionContainer;