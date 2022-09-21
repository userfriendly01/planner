import SaveButton from "../SaveButton";
import { UserFormButton } from "../../ClosedFlashMessage.Styles";
import React from "react";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents,
  skillsList,
  waitFor
} from "testUtils";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  updateFlashMessage,
  updateClosedMessage
} from "services";
import {
  ModalOverlayStatuses,
  timeouts
} from "globals";
import {
  ActionTypes,
  messageTypes
} from "../../ClosedFlashMessage.Interfaces";

jest.mock("../../ClosedFlashMessage.Styles", () => ({
  UserFormButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.useFakeTimers();

const mockDispatch = jest.fn();
const mockSetAction = jest.fn();
const mockSetSaveResult = jest.fn();
const mockSetConfirmationModalOpts = jest.fn();
const mockSetChecked = jest.fn();
const text = "I'm the new flash message.. save me!";
const nNumber = "n0263786";
const confirmationModalOpts = {

};

const renderComponent = (action, checked, messageType) => {
  return render(<SaveButton
    action={action}
    checked={checked}
    confirmationModalOpts={confirmationModalOpts}
    messageType={messageType}
    text={text}
    setAction={mockSetAction}
    setChecked={mockSetChecked}
    setConfirmationModalOpts={mockSetConfirmationModalOpts}
    setSaveResult={mockSetSaveResult}
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
        expect(UserFormButton.mock.calls[0][0].children).toBe("edit lscOBDialer1 Closed Message");
        expect(rendered.container).not.toHaveTextContent("No Skills Checked");
      });
    });
    describe("isMultiSelection === true && action !== view", () => {
      test("should render button with multiple selection text", () => {
        const rendered = renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls[0][0].children).toBe("edit 2 Closed Messages");
        expect(rendered.container).not.toHaveTextContent("No Skills Checked");
      });
    });
    describe("action === view", () => {
      test("button should not be rendered", () => {
        const rendered = renderComponent(ActionTypes.VIEW, [skillsList[0], skillsList[1]], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls.length).toBe(0);
        expect(rendered.container).not.toHaveTextContent("No Skills Checked");
      });
    });
    describe("no skills are checked", () => {
      test("button should not be rendered", () => {
        const rendered = renderComponent(ActionTypes.EDIT, [], messageTypes.CLOSED);
        expect(UserFormButton.mock.calls.length).toBe(0);
        expect(rendered.container).toHaveTextContent("No Skills Checked");
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
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).toBe("Are you sure you want to update the Flash Message for lscOBDialer1");
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
              test.only("dispatch should be called for all resolved promises", async () => {
                renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.FLASH);
                const saveButton = UserFormButton.mock.calls[0][0].onClick;
                act(() => {
                  saveButton();
                });
                const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
                act(() => {
                  onConfirm();
                });
                jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
                await waitFor(() => {
                  expect(mockSetAction).toHaveBeenCalledTimes(1);
                  expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.VIEW);
                  expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                  expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                  expect(mockSetChecked).toHaveBeenCalledWith([]);
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
                  expect(updateFlashMessage).toHaveBeenCalledTimes(2);
                  expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
                  expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);
                });
              });
            });
          });
          describe("partial promises are resolved", () => {
            beforeEach(() => {
              updateFlashMessage.mockResolvedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
              updateFlashMessage.mockRejectedValueOnce({
                config: {
                  data: JSON.stringify({
                    skill: "skillName",
                    flashMessage: "I'm a new flash message!"
                  })
                }
              });
            });
            test("dispatch should be called resolved promises and modal overlay should display failed skills", async () => {
              renderComponent(ActionTypes.EDIT, [skillsList[0], skillsList[1]], messageTypes.FLASH);
              const saveButton = UserFormButton.mock.calls[0][0].onClick;
              act(() => {
                saveButton();
              });
              const onConfirm = mockSetConfirmationModalOpts.mock.calls[0][0].callbackMethods.onConfirm;
              act(() => {
                onConfirm();
              });
              jest.advanceTimersByTime(timeouts.MODAL_OVERLAY);
              await waitFor(() => {
                expect(mockSetAction).toHaveBeenCalledTimes(1);
                expect(mockSetAction).toHaveBeenCalledWith(ActionTypes.VIEW);
                expect(mockSetConfirmationModalOpts).toHaveBeenCalledTimes(2);
                expect(mockSetSaveResult).toHaveBeenCalledTimes(3);
                expect(mockSetChecked).toHaveBeenCalledWith([]);
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
                expect(updateFlashMessage).toHaveBeenCalledTimes(2);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[0], text, nNumber);
                expect(updateFlashMessage).toHaveBeenCalledWith(skillsList[1], text, nNumber);
              });
            });
          });
          describe("all promises are rejected", () => {

          });
        });
        test("update function is called and results are handled", () => {

        });
        describe("handleCloseConfirmation is called", () => {

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
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).toBe("Are you sure you want to update the Closed Message for lscOBDialer1");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
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
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).toBe("Are you sure you want to delete the Flash Message for lscOBDialer1");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
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
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].confirmationText).toBe("Are you sure you want to delete the Closed Message for lscOBDialer1");
          expect(mockSetConfirmationModalOpts.mock.calls[0][0].open).toBe(true);
        });
      });
    });
    describe("action === undefined", () => {

    });
  });
});