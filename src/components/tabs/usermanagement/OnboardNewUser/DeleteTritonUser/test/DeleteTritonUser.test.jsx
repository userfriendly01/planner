import DeleteTritonUser from "../DeleteTritonUser";
import {
  ForwardToEntryForm,
  StyledButton
} from "components";
import {
  useAdminState,
  useFormState,
  useAdminDispatch
} from "context";
import React from "react";
import { terminateWorker } from "services";
import {
  act,
  initialFormState,
  initialTestState,
  render,
  waitFor
} from "testUtils";

jest.mock("components", () => ({
  ForwardToEntryForm: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("services", () => ({
  terminateWorker: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();
const mockUpdateLoading = jest.fn();
const mockWorker = initialTestState.workerContext.workers[6];
const termDate = new Date().toISOString().split("T")[0];
const expectedTerminatePayload = {
  nNumber: "n1234568",
  workerSid: "WK1234",
  email: "worker.mcgee@libertymutual.com",
  firstName: "Worker",
  lastName: "McGee",
  systems: ["TRITON", "QM"],
  terminationDate: termDate,
  inactiveForwardTo: ""
};

jest.useFakeTimers();

const renderComponent = () => {
  return render(<DeleteTritonUser
    handleClose={mockHandleClose}
    loading={{}}
    updateLoading={mockUpdateLoading}
  />);
};

describe("DeleteTritonUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useAdminDispatch.mockReturnValue(mockDispatch);
    useAdminState.mockReturnValue(initialTestState);
    useFormState.mockReturnValue({
      ...initialFormState,
      triton: {
        userFound: true,
        didUser: false
      },
      nNumber: {
        value: mockWorker.attributes.n_number
      }
    });
    terminateWorker.mockResolvedValue("Yay!");
  });
  describe("initial render", () => {
    describe("worker is DID", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          triton: {
            userFound: true,
            didUser: true
          },
          nNumber: {
            value: mockWorker.attributes.n_number
          }
        });
      });
      test("component renders with ForwardToEntryForm", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Note: there is a grace period of 2 days before this user will be permanently deleted");
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(1);
        expect(ForwardToEntryForm.mock.calls[0][0].label).toBe("This user has a direct dial number. Please choose a forward to option before confirming.");
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
      });
      describe("updateForwardTo is called", () => {
        test("inactiveForwardTo is set when delete is submitted", () => {
          renderComponent();
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          act(() => updateForwardTo("callmebeepme"));
          expect(StyledButton).toHaveBeenCalledTimes(4);
          const confirmDelete = StyledButton.mock.calls[1][0].onClick;
          act(() => confirmDelete());
          expect(terminateWorker).toHaveBeenCalledTimes(1);
          expect(terminateWorker.mock.calls[0][0].inactiveForwardTo).toBe("callmebeepme");
        });
        test("inactiveForwardTo is cleared when delete is submitted", () => {
          renderComponent();
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          act(() => updateForwardTo(""));
          expect(StyledButton).toHaveBeenCalledTimes(2);
          const confirmDelete = StyledButton.mock.calls[1][0].onClick;
          act(() => confirmDelete());
          expect(terminateWorker).toHaveBeenCalledTimes(1);
          expect(terminateWorker.mock.calls[0][0].inactiveForwardTo).toBe("");
        });
      });
    });
    describe("worker is not DID", () => {
      test("component renders without ForwardToEntryForm", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Note: there is a grace period of 2 days before this user will be permanently deleted");
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(0);
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
      });
    });
  });

  describe("handleDeleteUser is clicked", () => {
    describe("service call succeeds", () => {
      test("terminateWorker is called", async () => {
        terminateWorker.mockResolvedValueOnce({ data: "user n1234568 successfully added to the termination database. Will be terminated at Sat Oct 28 2023 13:44:29 GMT+0000 (stuff)" });
        renderComponent();
        expect(StyledButton).toHaveBeenCalledTimes(2);
        const confirmDelete = StyledButton.mock.calls[1][0].onClick;
        act(() => confirmDelete());
        expect(terminateWorker).toHaveBeenCalledTimes(1);
        expect(terminateWorker.mock.calls[0][0]).toEqual(expectedTerminatePayload);
        jest.runAllTimers();
        await waitFor(() => {
          expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Deleting user: Worker McGee",
            saveStatus: "saving",
            saveUser: true
          });
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "user n1234568 successfully added to the termination database. Will be terminated at Sat Oct 28 2023 13:44:29 GMT",
            saveStatus: "success",
            saveUser: true
          });
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            saveUser: false
          });
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "deleteWorker",
            payload: mockWorker.sid
          });
        });
      });
    });
    describe("service call fails", () => {
      beforeEach(() => {
        terminateWorker.mockRejectedValue({
          response: {
            data: {
              error: "Boo"
            }
          }
        });
      });
      test("error is handled", async () => {
        renderComponent();
        expect(StyledButton).toHaveBeenCalledTimes(2);
        const confirmDelete = StyledButton.mock.calls[1][0].onClick;
        act(() => confirmDelete());
        expect(terminateWorker).toHaveBeenCalledTimes(1);
        expect(terminateWorker.mock.calls[0][0]).toEqual(expectedTerminatePayload);
        await waitFor(() => {
          expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Deleting user: Worker McGee",
            saveStatus: "saving",
            saveUser: true
          });
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Error Deleting Triton User. Boo",
            saveStatus: "fail",
            saveUser: true
          });
          expect(mockDispatch).toHaveBeenCalledTimes(0);
        });
      });
      describe("error is an object", () => {
        beforeEach(() => {
          terminateWorker.mockRejectedValue({
            response: {
              data: {
                error: {
                  boo: "Boo"
                }
              }
            }
          });
        });
        test("error is handled", async () => {
          renderComponent();
          expect(StyledButton).toHaveBeenCalledTimes(2);
          const confirmDelete = StyledButton.mock.calls[1][0].onClick;
          act(() => confirmDelete());
          expect(terminateWorker).toHaveBeenCalledTimes(1);
          expect(terminateWorker.mock.calls[0][0]).toEqual(expectedTerminatePayload);
          await waitFor(() => {
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              overlayMessage: "Deleting user: Worker McGee",
              saveStatus: "saving",
              saveUser: true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              overlayMessage: `Error Deleting Triton User. Failed to terminate worker ${mockWorker.sid}`,
              saveStatus: "fail",
              saveUser: true
            });
            expect(mockDispatch).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
  });
  describe("handleClose is called", () => {
    test("terminateWorker is called", () => {
      renderComponent();
      expect(StyledButton).toHaveBeenCalledTimes(2);
      const onClose = StyledButton.mock.calls[0][0].onClick;
      act(() => onClose());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});