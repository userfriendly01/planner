import ConfirmationModal from "../ConfirmationModal";
import {
  ForwardToEntryForm,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ForwardToEntryForm: jest.fn(),
  StyledButton: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleConfirm = jest.fn();
const mockSetForwardTo = jest.fn();
const mockDIDWorker = {
  sid: "WK1234567",
  directDialNum: "+12256648857"
};
const mockNoDIDWorker = {
  sid: "WK1234567",
  attributes: {
    attribute: "butts"
  }
};
const mockWorkers = [
  {
    sid: "WK111111",
    attributes: {
      full_name: "Worker A"
    }
  },
  {
    sid: "WK222222",
    attributes: {
      full_name: "Worker B"
    }
  },
  {
    sid: "WK33333",
    attributes: {
      full_name: "Worker C"
    }
  }
];
const mockSkills = [
  {
    skill: "skill1"
  },
  {
    skill: "skill2"
  },
  {
    skill: "skill2"
  }
];

const initialSaveResult = {
  status: null,
  message: null
};

const data = {
  confirmationText: "Are you sure?",
  displayData: "Peter Griffin",
  skills: mockSkills,
  workers: mockWorkers
};

const renderComponent = selectedWorker => {
  return render(<ConfirmationModal
    callbackMethods={{
      handleClose: mockHandleClose,
      onConfirm: mockHandleConfirm,
      setForwardTo: mockSetForwardTo
    }}
    data={{
      ...data,
      selectedWorker
    }}
    saveResult={initialSaveResult} />);
};

describe("<ConfirmationModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ForwardToEntryForm,
      StyledButton,
      ModalOverlay
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });
  describe("ConfirmationModal is shown for a non DID user", () => {
    describe("ConfirmationModal is in its initial state", () => {
      test("should pass confirmationText and confirm/cancel functions, and the save result", () => {
        const rendered = renderComponent(mockNoDIDWorker);
        expect(rendered.container).toHaveTextContent("Are you sure?");
        expect(rendered.container).toHaveTextContent("Peter Griffin");
        expectMockedComponent(rendered, { StyledButton }, 2);
        expectMockedComponent(rendered, { ModalOverlay }, 0);
        expectMockedComponent(rendered, { ForwardToEntryForm }, 0);
      });
    });
    describe("Confirm Button", () => {
      test("When the Confirm Button is clicked, handleConfirm is called", () => {
        renderComponent(mockNoDIDWorker);
        expectOnlyPassedProps(StyledButton, {
          onClick: mockHandleConfirm
        }, 0);
        const disabled = StyledButton.mock.calls[0][0].disabled;
        expect(disabled).toBe(undefined);
        const confirm = StyledButton.mock.calls[0][0].onClick;
        act(() => confirm());
        expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
      });
    });
    describe("Cancel Button", () => {
      test("When the Cancel Button is clicked, handleClose is called", () => {
        renderComponent(mockNoDIDWorker);
        expectOnlyPassedProps(StyledButton, {
          onClick: mockHandleClose
        }, 1);
        const cancel = StyledButton.mock.calls[1][0].onClick;
        act(() => cancel());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
    });
    describe("When the Save Result is not null, ModalOverlay is present", () => {
      const renderComponent = saveResult => {
        return render(<ConfirmationModal
          callbackMethods={{
            handleClose: mockHandleClose,
            onConfirm: mockHandleConfirm,
            setForwardTo: mockSetForwardTo
          }}
          data={{
            ...data,
            selectedWorker: mockNoDIDWorker
          }}
          saveResult={saveResult} />);
      };
      test("When the Save Result is successful, the ModalOverlay is passed the correct props, handleClose is run", () => {
        const rendered = renderComponent({
          status: "success",
          message: "yay!"
        });
        expectMockedComponent(rendered, { ModalOverlay }, 1);
        expectOnlyPassedProps(ModalOverlay, {
          handleClose: mockHandleClose,
          status: "success",
          message: "yay!"
        }, 0);
      });
      test("When the Save Result is fail, the ModalOverlay is passed the correct props, handleClose is run", () => {
        const rendered = renderComponent({
          status: "fail",
          message: "boo!"
        });
        expectMockedComponent(rendered, { ModalOverlay }, 1);
        expectOnlyPassedProps(ModalOverlay, {
          handleClose: mockHandleClose,
          status: "fail",
          message: "boo!"
        }, 0);
      });
    });
  });
  describe("ConfirmationModal is shown for a DID user", () => {
    describe("ConfirmationModal is in its initial state", () => {
      test("should pass confirmationText and confirm/cancel functions, and the save result", () => {
        const rendered = renderComponent(mockDIDWorker);
        expect(rendered.container).toHaveTextContent("Are you sure?");
        expect(rendered.container).toHaveTextContent("Peter Griffin");
        expectMockedComponent(rendered, { StyledButton }, 2);
        expectMockedComponent(rendered, { ModalOverlay }, 0);
        expectMockedComponent(rendered, { ForwardToEntryForm }, 1);
      });
    });
    describe("Confirm Button", () => {
      test("When its a DID user and the inactiveForwardTo is not set, the confirm button is disabled", () => {
        const selectedWorker = {
          sid: "WK123456",
          directDialNum: "+16038518200"
        };
        renderComponent(selectedWorker);
        const disabled = StyledButton.mock.calls[0][0].disabled;
        expect(disabled).toBe(true);
      });
      test("When its a DID user and the inactiveForwardTo is set, the confirm button will be enabled", () => {
        const selectedWorker = {
          sid: "WK123456",
          directDialNum: "+16038518200",
          inactiveForwardTo: "aisg12"
        };
        renderComponent(selectedWorker);
        const disabled = StyledButton.mock.calls[0][0].disabled;
        expect(disabled).toBe(undefined);
      });
      test("When the Confirm Button is clicked, handleConfirm is called", () => {
        renderComponent(mockDIDWorker);
        expectOnlyPassedProps(StyledButton, {
          onClick: mockHandleConfirm
        }, 0);
        const confirm = StyledButton.mock.calls[0][0].onClick;
        act(() => confirm());
        expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
      });
    });
    describe("Cancel Button", () => {
      test("When the Cancel Button is clicked, handleClose is called", () => {
        renderComponent(mockDIDWorker);
        expectOnlyPassedProps(StyledButton, {
          onClick: mockHandleClose
        }, 1);
        const cancel = StyledButton.mock.calls[1][0].onClick;
        act(() => cancel());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
    });
    describe("When the Save Result is not null, ModalOverlay is present", () => {
      const renderComponent = saveResult => {
        return render(<ConfirmationModal
          callbackMethods={{
            handleClose: mockHandleClose,
            onConfirm: mockHandleConfirm,
            setForwardTo: mockSetForwardTo
          }}
          data={{
            ...data,
            selectedWorker: mockDIDWorker
          }}
          saveResult={saveResult} />);
      };
      test("When the Save Result is successful, the ModalOverlay is passed the correct props, handleClose is run", () => {
        const rendered = renderComponent({
          status: "success",
          message: "yay!"
        });
        expectMockedComponent(rendered, { ModalOverlay }, 1);
        expectOnlyPassedProps(ModalOverlay, {
          handleClose: mockHandleClose,
          status: "success",
          message: "yay!"
        }, 0);
      });
      test("When the Save Result is fail, the ModalOverlay is passed the correct props, handleClose is run", () => {
        const rendered = renderComponent({
          status: "fail",
          message: "boo!"
        });
        expectMockedComponent(rendered, { ModalOverlay }, 1);
        expectOnlyPassedProps(ModalOverlay, {
          handleClose: mockHandleClose,
          status: "fail",
          message: "boo!"
        }, 0);
      });
    });
    describe("updateForwardTo", () => {
      test("When updateForwardTo is called, state is updated", () => {
        renderComponent(mockDIDWorker);
        const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
        updateForwardTo("aisgl1");
        expect(mockSetForwardTo).toHaveBeenCalledTimes(1);
        expect(mockSetForwardTo).toHaveBeenCalledWith("aisgl1");
      });
    });
  });
});