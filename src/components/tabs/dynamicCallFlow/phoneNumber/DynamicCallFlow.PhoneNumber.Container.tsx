import PhoneNumberDataGridComponent from "./DataGrid/PhoneNumber.DataGrid.Component";
import { useAccessToken } from "authentication";
import {
  LoginInProgress,
  LoginError
} from "components";
import React, {
  createContext, useState, useRef, useEffect
} from "react";
import {
  MODAL_NOT_IN_USE, ModalController
} from "../common/Modal.Controller";
import { PhoneNumberModalType } from "./DynamicCallFlow.PhoneNumber.Container.Modal.Controller";
import { DynamicCallFlowContextStore } from "../common/DynamicCallFlow.Interfaces";

export const DynamicCallFlowPhoneNumberContext = createContext<DynamicCallFlowContextStore<PhoneNumberModalType>>(undefined);

const DynamicCallFlowPhoneNumberContainer = () => {
  const {
    accessToken,
    matchedGroups,
    isLoading,
    error
  } = useAccessToken();

  const modalController = useRef<ModalController<PhoneNumberModalType>>(new ModalController<PhoneNumberModalType>());
  const [currentOpenModal, setCurrentOpenModal] = useState<PhoneNumberModalType>(MODAL_NOT_IN_USE);

  const openModal = (modalType: PhoneNumberModalType) => {
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
    <DynamicCallFlowPhoneNumberContext.Provider value={ {
      accessToken,
      matchedGroups,
      currentOpenModal,
      modalController
    } }>
      <PhoneNumberDataGridComponent />
    </DynamicCallFlowPhoneNumberContext.Provider>
  );
};

export default DynamicCallFlowPhoneNumberContainer;