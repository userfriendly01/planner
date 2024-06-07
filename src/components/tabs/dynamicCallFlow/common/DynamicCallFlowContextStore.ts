import React from "react";
import { ModalController } from "./Modal.Controller";

export interface DynamicCallFlowContextStore<ModalType> {
  accessToken: string;
  matchedGroups: string[];
  currentOpenModal: ModalType;
  modalController: React.MutableRefObject<ModalController<ModalType>>;
}
