import ModalController, { MODAL_NOT_IN_USE } from "dynamicCallFlowCommon/Modal.Controller";

describe("ModalController", () => {
  it("shouldSetOpenModalRef", () => {
    const controller = new ModalController<string>();
    const openModalMock = jest.fn();
    controller.setOpenModalRef(openModalMock);
    controller.openModal("TestModal");
    expect(openModalMock).toHaveBeenCalledWith("TestModal");
  });

  it("shouldSetCloseModalRef", () => {
    const controller = new ModalController<string>();
    const closeModalMock = jest.fn();
    controller.setCloseModalRef(closeModalMock);
    controller.closeModal();
    expect(closeModalMock).toHaveBeenCalled();
  });

  it("shouldOpenModalWithGivenType", () => {
    const controller = new ModalController<string>();
    const openModalMock = jest.fn();
    controller.setOpenModalRef(openModalMock);
    controller.openModal("TestModal");
    expect(openModalMock).toHaveBeenCalledWith("TestModal");
  });

  it("shouldOpenModalWithNotInUseType", () => {
    const controller = new ModalController<string>();
    const openModalMock = jest.fn();
    controller.setOpenModalRef(openModalMock);
    controller.openModal(MODAL_NOT_IN_USE);
    expect(openModalMock).toHaveBeenCalledWith(MODAL_NOT_IN_USE);
  });

  it("shouldCloseModal", () => {
    const controller = new ModalController<string>();
    const closeModalMock = jest.fn();
    controller.setCloseModalRef(closeModalMock);
    controller.closeModal();
    expect(closeModalMock).toHaveBeenCalled();
  });
});