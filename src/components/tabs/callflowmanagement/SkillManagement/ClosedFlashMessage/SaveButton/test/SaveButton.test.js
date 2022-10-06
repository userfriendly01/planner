import SaveButton from "../SaveButton";
import {
  UserFormButton,
  messageTypes
} from "../../";
import { ActionTypes } from "../../../";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  ModalOverlayStatuses,
  timeouts
} from "globals";
import React from "react";
import {
  updateFlashMessage,
  updateClosedMessage
} from "services";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents,
  skillsList,
  waitFor
} from "testUtils";

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("../../../", () => ({
  ActionTypes: jest.requireActual("../../../").ActionTypes
}));

jest.mock("../../", () => ({
  UserFormButton: jest.fn(),
  messageTypes: jest.requireActual("../../").messageTypes,
  ConfirmationDiv: jest.requireActual("../../").ConfirmationDiv,
  ConfirmationExportDiv: jest.requireActual("../../").ConfirmationExportDiv
}));
jest.useFakeTimers();

const mockDispatch = jest.fn();
const mockSetAction = jest.fn();
const mockSetSaveResult = jest.fn();
const mockSetTableState = jest.fn();
const mockSetConfirmationModalOpts = jest.fn();
const text = "I'm the new flash message.. save me!";
const nNumber = "n0263786";
const confirmationModalOpts = {

};

const renderComponent = (action, selected, messageType) => {
  return render(<SaveButton
    action={action}
    confirmationModalOpts={confirmationModalOpts}
    messageType={messageType}
    tableState={{
      selected: selected || []
    }}
    text={text}
    setAction={mockSetAction}
    setConfirmationModalOpts={mockSetConfirmationModalOpts}
    setSaveResult={mockSetSaveResult}
    setTableState={mockSetTableState}
  />);
};


describe("<SaveButton /> ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      UserFormButton
    });
  });
  describe("initial render", () => {
    describe("isSingleSelection === true && action !== view", () => {
      test("should render button with single selection text", () => {
        const rendered = renderComponent(ActionTypes.EDIT, [skillsList[0]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls[0][0].children).toBe("Edit lscOBDialer1 Closed Message");
        expect(rendered.container).not.toHaveTextContent("Select a skill to move forward");
      });
    });
    describe("isMultiSelection === true && action !== view", () => {
      test("should render button with multiple selection text", () => {
        const rendered = renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls[0][0].children).toBe("Edit 2 Closed Messages");
        expect(rendered.container).not.toHaveTextContent("Select a skill to move forward");
      });
    });
    describe("action === view", () => {
      test("button should not be rendered", () => {
        const rendered = renderComponent(ActionTypes.VIEW, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls.length).toBe(0);
        expect(rendered.container).not.toHaveTextContent("Select a skill to move forward");
      });
    });
    describe("no skills are selected", () => {
      test("button should not be rendered", () => {
        const rendered = renderComponent(ActionTypes.EDIT, [], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls.length).toBe(0);
        expect(rendered.container).toHaveTextContent("Select a skill to move forward");
      });
    });
  });
  describe("handleOnSave is called", () => {
    describe("action === edit", () => {
      describe("messageType is FLASH", () => {
        test("confirmation modal options are set to expected properties", () => {
          renderComponent(ActionTypes.EDIT, [skillsList[0]], messageTypes.FLASH);
          const saveButton = UserFormButton.mock.calls[0][0].onClick;
          act(() => {
            saveButton();
          });
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const confirmationDiv = render(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).container;
          expect(confirmationDiv).toHaveTextContent("Are you sure you want to update the Flash Message for lscOBDialer1?");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
        });
        describe("onConfirm is called", () => {
          describe("handleResults", () => {
            describe("all promises are resolved", () => {
              beforeEach(() => {
                updateFlashMessage.mockResolvedValue({
                  config: {
                    data: JSON.stringify({
                      skill: "aisgL1",
                      flashMessage: "I'm a new flash message!"
                    })
                  }
                });
              });
              test("dispatch should be called for all resolved promises", async () => {
                renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.FLASH);
                const saveButton = UserFormButton.mock.calls[0][0].onClick;
                act(() => {
                  saveButton();
                });
                const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
                act(() => {
                  onConfirm();
                });
                expect(updateFlashMessage).toHaveBeenCalledTimes(2);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);

                jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
                await waitFor(() => {
                  expect(mockSetAction).toHaveBeenCalledTimes(1);
                  expect(mockSetAction).toHaveBeenCalledWith(null);
                  expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Processing...",
                    status: ModalOverlayStatuses.SAVING
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Request Successfully Processed",
                    status: ModalOverlayStatuses.SUCCESS
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "",
                    status: null
                  });
                  expect(mockDispatch).toHaveBeenCalledTimes(1);

                });
              });
            });
          });
          describe("partial promises are resolved", () => {
            beforeEach(() => {
              updateFlashMessage.mockRejectedValueOnce("aww");
              updateFlashMessage.mockResolvedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
              updateFlashMessage.mockRejectedValueOnce("aww");
            });
            test("dispatch should be called resolved promises and modal overlay should display partial fail skills", async () => {
              renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1], skillsList[2]], messageTypes.FLASH);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateFlashMessage).toHaveBeenCalledTimes(3);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[2], text, nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "The following skills failed to update: lscOBDialer1, bscCommisssions",
                  status: ModalOverlayStatuses.PARTIAL_FAIL
                });
                expect(mockDispatch).toHaveBeenCalledTimes(1);
              });
            });
          });
          describe("all promises are rejected", () => {
            beforeEach(() => {
              updateFlashMessage.mockRejectedValueOnce("aww");
              updateFlashMessage.mockRejectedValueOnce("aww");
            });
            test("modal overlay should display as failed", async () => {
              renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[2]], messageTypes.FLASH);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateFlashMessage).toHaveBeenCalledTimes(2);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[2], text, nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Request Failed",
                  status: ModalOverlayStatuses.FAIL
                });
                expect(mockSetAction).toHaveBeenCalledTimes(0);
                expect(mockDispatch).toHaveBeenCalledTimes(0);
              });
            });
          });
        });
      });
      describe("messageType is CLOSED", () => {
        test("confirmation modal options are set to expected properties", () => {
          renderComponent(ActionTypes.EDIT, [skillsList[0]], messageTypes.CLOSED);
          const saveButton = UserFormButton.mock.calls[0][0].onClick;
          act(() => {
            saveButton();
          });
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const confirmationDiv = render(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).container;
          expect(confirmationDiv).toHaveTextContent("Are you sure you want to update the Closed Message for lscOBDialer1");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
        });
        describe("onConfirm is called", () => {
          describe("handleResults", () => {
            describe("all promises are resolved", () => {
              beforeEach(() => {
                updateClosedMessage.mockResolvedValue({
                  config: {
                    data: JSON.stringify({
                      skill: "skillName",
                      flashMessage: "I'm a new flash message!"
                    })
                  }
                });
              });
              test("dispatch should be called for all resolved promises", async () => {
                renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
                const saveButton = UserFormButton.mock.calls[0][0].onClick;
                act(() => {
                  saveButton();
                });
                const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
                act(() => {
                  onConfirm();
                });
                expect(updateClosedMessage).toHaveBeenCalledTimes(2);
                expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
                expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);

                jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
                await waitFor(() => {
                  expect(mockSetAction).toHaveBeenCalledTimes(1);
                  expect(mockSetAction).toHaveBeenCalledWith(null);
                  expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Processing...",
                    status: ModalOverlayStatuses.SAVING
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Request Successfully Processed",
                    status: ModalOverlayStatuses.SUCCESS
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "",
                    status: null
                  });
                  expect(mockDispatch).toHaveBeenCalledTimes(1);

                });
              });
            });
          });
          describe("partial promises are resolved", () => {
            beforeEach(() => {
              updateClosedMessage.mockRejectedValueOnce("aww");
              updateClosedMessage.mockResolvedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
              updateClosedMessage.mockRejectedValueOnce("aww");
            });
            test("dispatch should be called resolved promises and modal overlay should display partial fail skills", async () => {
              renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1], skillsList[2]], messageTypes.CLOSED);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateClosedMessage).toHaveBeenCalledTimes(3);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[2], text, nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "The following skills failed to update: lscOBDialer1, bscCommisssions",
                  status: ModalOverlayStatuses.PARTIAL_FAIL
                });
                expect(mockDispatch).toHaveBeenCalledTimes(1);
              });
            });
          });
          describe("all promises are rejected", () => {
            beforeEach(() => {
              updateClosedMessage.mockRejectedValueOnce("aww");
              updateClosedMessage.mockRejectedValueOnce("aww");
            });
            test("modal overlay should display as failed", async () => {
              renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[2]], messageTypes.CLOSED);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateClosedMessage).toHaveBeenCalledTimes(2);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[2], text, nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Request Failed",
                  status: ModalOverlayStatuses.FAIL
                });
                expect(mockSetAction).toHaveBeenCalledTimes(0);
                expect(mockDispatch).toHaveBeenCalledTimes(0);
              });
            });
          });
        });
      });
    });
    describe("action === delete", () => {
      describe("messageType is FLASH", () => {
        test("confirmation modal options are set to expected properties", () => {
          renderComponent(ActionTypes.DELETE, [skillsList[0]], messageTypes.FLASH);
          const saveButton = UserFormButton.mock.calls[0][0].onClick;
          act(() => {
            saveButton();
          });
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const confirmationDiv = render(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).container;
          expect(confirmationDiv).toHaveTextContent("Are you sure you want to delete the Flash Message for lscOBDialer1?");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
        });
        describe("onConfirm is called", () => {
          describe("handleResults", () => {
            describe("all promises are resolved", () => {
              beforeEach(() => {
                updateFlashMessage.mockResolvedValue({
                  config: {
                    data: JSON.stringify({
                      skill: "skillName",
                      flashMessage: "I'm a new flash message!"
                    })
                  }
                });
              });
              test("dispatch should be called for all resolved promises", async () => {
                renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[1]], messageTypes.FLASH);
                const saveButton = UserFormButton.mock.calls[0][0].onClick;
                act(() => {
                  saveButton();
                });
                const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
                act(() => {
                  onConfirm();
                });
                expect(updateFlashMessage).toHaveBeenCalledTimes(2);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], "", nNumber);

                jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
                await waitFor(() => {
                  expect(mockSetAction).toHaveBeenCalledTimes(1);
                  expect(mockSetAction).toHaveBeenCalledWith(null);
                  expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Processing...",
                    status: ModalOverlayStatuses.SAVING
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Request Successfully Processed",
                    status: ModalOverlayStatuses.SUCCESS
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "",
                    status: null
                  });
                  expect(mockDispatch).toHaveBeenCalledTimes(1);

                });
              });
            });
          });
          describe("partial promises are resolved", () => {
            beforeEach(() => {
              updateFlashMessage.mockRejectedValueOnce("aww");
              updateFlashMessage.mockResolvedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
              updateFlashMessage.mockRejectedValueOnce("aww");
            });
            test("dispatch should be called resolved promises and modal overlay should display partial fail skills", async () => {
              renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[1], skillsList[2]], messageTypes.FLASH);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateFlashMessage).toHaveBeenCalledTimes(3);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], "", nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[2], "", nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "The following skills failed to update: lscOBDialer1, bscCommisssions",
                  status: ModalOverlayStatuses.PARTIAL_FAIL
                });
                expect(mockDispatch).toHaveBeenCalledTimes(1);
              });
            });
          });
          describe("all promises are rejected", () => {
            beforeEach(() => {
              updateFlashMessage.mockRejectedValueOnce("aww");
              updateFlashMessage.mockRejectedValueOnce("aww");
            });
            test("modal overlay should display as failed", async () => {
              renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[2]], messageTypes.FLASH);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateFlashMessage).toHaveBeenCalledTimes(2);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
              expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[2], "", nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Request Failed",
                  status: ModalOverlayStatuses.FAIL
                });
                expect(mockSetAction).toHaveBeenCalledTimes(0);
                expect(mockDispatch).toHaveBeenCalledTimes(0);
              });
            });
          });
        });
      });
      describe("messageType is CLOSED", () => {
        test("confirmation modal options are set to expected properties", () => {
          renderComponent(ActionTypes.DELETE, [skillsList[0]], messageTypes.CLOSED);
          const saveButton = UserFormButton.mock.calls[0][0].onClick;
          act(() => {
            saveButton();
          });
          expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
          const confirmationDiv = render(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).container;
          expect(confirmationDiv).toHaveTextContent("Are you sure you want to delete the Closed Message for lscOBDialer1?");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
        });
        describe("onConfirm is called", () => {
          describe("handleResults", () => {
            describe("all promises are resolved", () => {
              beforeEach(() => {
                updateClosedMessage.mockResolvedValue({
                  config: {
                    data: JSON.stringify({
                      skill: "skillName",
                      flashMessage: "I'm a new flash message!"
                    })
                  }
                });
              });
              test("dispatch should be called for all resolved promises", async () => {
                renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
                const saveButton = UserFormButton.mock.calls[0][0].onClick;
                act(() => {
                  saveButton();
                });
                const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
                act(() => {
                  onConfirm();
                });
                expect(updateClosedMessage).toHaveBeenCalledTimes(2);
                expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
                expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[1], "", nNumber);

                jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
                await waitFor(() => {
                  expect(mockSetAction).toHaveBeenCalledTimes(1);
                  expect(mockSetAction).toHaveBeenCalledWith(null);
                  expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Processing...",
                    status: ModalOverlayStatuses.SAVING
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "Request Successfully Processed",
                    status: ModalOverlayStatuses.SUCCESS
                  });
                  expect(mockSetSaveResult).toHaveBeenCalledWith({
                    message: "",
                    status: null
                  });
                  expect(mockDispatch).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
          describe("partial promises are resolved", () => {
            beforeEach(() => {
              updateClosedMessage.mockRejectedValueOnce("aww");
              updateClosedMessage.mockResolvedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
              updateClosedMessage.mockRejectedValueOnce("aww");
            });
            test("dispatch should be called resolved promises and modal overlay should display partial fail skills", async () => {
              renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[1], skillsList[2]], messageTypes.CLOSED);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateClosedMessage).toHaveBeenCalledTimes(3);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[1], "", nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[2], "", nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "The following skills failed to update: lscOBDialer1, bscCommisssions",
                  status: ModalOverlayStatuses.PARTIAL_FAIL
                });
                expect(mockDispatch).toHaveBeenCalledTimes(1);
              });
            });
          });
          describe("all promises are rejected", () => {
            beforeEach(() => {
              updateClosedMessage.mockRejectedValueOnce("aww");
              updateClosedMessage.mockRejectedValueOnce("aww");
            });
            test("modal overlay should display as failed", async () => {
              renderComponent(ActionTypes.DELETE, [skillsList[0], skillsList[2]], messageTypes.CLOSED);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              expect(updateClosedMessage).toHaveBeenCalledTimes(2);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[0], "", nNumber);
              expect(updateClosedMessage).toHaveBeenCalledWith(skillsList[2], "", nNumber);

              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(1);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Processing...",
                  status: ModalOverlayStatuses.SAVING
                });
                expect(mockSetSaveResult).toHaveBeenCalledWith({
                  message: "Request Failed",
                  status: ModalOverlayStatuses.FAIL
                });
                expect(mockSetAction).toHaveBeenCalledTimes(0);
                expect(mockDispatch).toHaveBeenCalledTimes(0);
              });
            });
          });
        });
      });
    });
    describe("action is undefined", () => {
      test("nothing happens", () => {
        renderComponent({ label: "Undefined Action" }, [skillsList[0]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls.length).toBe(1);
        const saveButton = UserFormButton.mock.calls[0][0].onClick;
        act(() => {
          saveButton();
        });
        expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(0);
      });
    });
  });
});