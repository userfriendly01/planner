export interface ContainerModalController<ModalType> {
  setOpenModalRef(openModal: (modalType: ModalType) => void): void;
  setCloseModalRef(closeModal: () => void): void;
  openModal(modalType: ModalType | NotInUseModalType): void;
  closeModal(): void;
}

export type NotInUseModalType = "Modal Not In Use";
export const MODAL_NOT_IN_USE: NotInUseModalType = "Modal Not In Use";

export default class ModalController<ModalType> implements ContainerModalController<ModalType> {
  private _openModal: (modalType: ModalType | NotInUseModalType) => void;
  private _closeModal: () => void;

  setOpenModalRef(openModal: (modalType: ModalType) => void): void {
    this._openModal = openModal;
  }

  setCloseModalRef(closeModal: () => void): void {
    this._closeModal = closeModal;
  }

  openModal(modalType: ModalType | NotInUseModalType): void {
    console.info("######### setting currentOpenModal to: ", modalType);
    this._openModal(modalType);
  }

  closeModal(): void {
    console.info("%%%%%% close modal");
    this._closeModal();
  }
}