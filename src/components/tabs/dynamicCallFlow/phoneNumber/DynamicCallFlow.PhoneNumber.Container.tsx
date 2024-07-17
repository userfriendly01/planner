import PhoneNumberDataGridComponent from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Component";
import React, {
  createContext, useState, useRef, useEffect
} from "react";
import ModalController, {
  MODAL_NOT_IN_USE
} from "components/tabs/dynamicCallFlow/common/Modal.Controller";
import { DynamicCallFlowContextStore } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { useAdminState } from "context/appContext";
import { PhoneNumberModalType } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Interfaces";

export const DynamicCallFlowPhoneNumberContext = createContext<DynamicCallFlowContextStore<PhoneNumberModalType>>(undefined);

const DynamicCallFlowPhoneNumberContainer = () => {
  const {
    userContext: {
      permissions,
      tokens: {
        sharedGraph
      }
    }
  } = useAdminState();

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

  return (
    <DynamicCallFlowPhoneNumberContext.Provider value={ {
      accessTokenGraph: sharedGraph,
      permissions,
      currentOpenModal,
      modalController
    } }>
      <PhoneNumberDataGridComponent />
    </DynamicCallFlowPhoneNumberContext.Provider>
  );
};

export default DynamicCallFlowPhoneNumberContainer;