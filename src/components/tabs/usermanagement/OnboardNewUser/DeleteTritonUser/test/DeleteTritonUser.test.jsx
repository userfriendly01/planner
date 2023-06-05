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
import { deleteUser } from "services";
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
  deleteUser: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();
const mockUpdateLoading = jest.fn();
const mockWorker = initialTestState.workerContext.workers[0];

jest.useFakeTimers();

const renderComponent = () => {
  return render(<DeleteTritonUser
    handleClose={mockHandleClose}
    loading={{}}
    updateLoading={mockUpdateLoading}
  />)
}

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
        didUser: false,
      },
      nNumber: {
        value: mockWorker.attributes.n_number
      }
    });
    deleteUser.mockResolvedValue("Yay!");
  });
  describe("initial render", () => {
    describe("worker is DID", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          triton: {
            userFound: true,
            didUser: true,
          },
          nNumber: {
            value: mockWorker.attributes.n_number
          }
        })
      });
      test("component renders with ForwardToEntryForm", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("This user will be deactivated in Triton.");
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(1);
        expect(ForwardToEntryForm.mock.calls[0][0].label).toBe("This user has a direct dial number. Please choose a forward to option before confirming.")
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
      });
      describe("updateForwardTo is called", () => {
        test("inactiveForwardTo is set when delete is submitted", () => {
          renderComponent();
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          act(() => updateForwardTo("callmebeepme"))
          expect(StyledButton).toHaveBeenCalledTimes(2);
          const confirmDelete = StyledButton.mock.calls[1][0].onClick;
          act(() => confirmDelete());
          expect(deleteUser).toHaveBeenCalledTimes(1);
          expect(deleteUser.mock.calls[0][0].inactiveForwardTo).toBe("callmebeepme");
        });
      });
    });
    describe("worker is not DID", () => {
      test("component renders without ForwardToEntryForm", () => {
        const rendered = renderComponent()
        expect(rendered.container).toHaveTextContent("This user will be deactivated in Triton.");
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(0);
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
      });
    });
  });

  describe("handleDeleteUser is clicked", () => {
    describe("service call succeeds", () => {
      test("deleteUser is called", async () => {
        renderComponent();
        expect(StyledButton).toHaveBeenCalledTimes(2);
        const confirmDelete = StyledButton.mock.calls[1][0].onClick;
        act(() => confirmDelete());
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(deleteUser.mock.calls[0][0]).toBe(mockWorker);
        jest.runAllTimers();
        await waitFor(() => {
          expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Deleting user: Faith Cuneo",
            saveStatus: "saving", 
            saveUser: true
          });
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Successfully Deleted User",
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
        deleteUser.mockRejectedValue({
          response: {
            data: {
              error: "Boo"
            }
          }
        });
      })
      test("error is handled", async () => {
        renderComponent();
        expect(StyledButton).toHaveBeenCalledTimes(2);
        const confirmDelete = StyledButton.mock.calls[1][0].onClick;
        act(() => confirmDelete());
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(deleteUser.mock.calls[0][0]).toBe(mockWorker);
        await waitFor(() => {
          expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Deleting user: Faith Cuneo",
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
          deleteUser.mockRejectedValue({
            response: {
              data: {
                error: {
                  boo: "Boo"
                }
              }
            }
          });
        })
        test("error is handled", async () => {
          renderComponent();
          expect(StyledButton).toHaveBeenCalledTimes(2);
          const confirmDelete = StyledButton.mock.calls[1][0].onClick;
          act(() => confirmDelete());
          expect(deleteUser).toHaveBeenCalledTimes(1);
          expect(deleteUser.mock.calls[0][0]).toBe(mockWorker);
          await waitFor(() => {
            expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              overlayMessage: "Deleting user: Faith Cuneo",
              saveStatus: "saving", 
              saveUser: true
            });
            expect(mockUpdateLoading).toHaveBeenCalledWith({
              overlayMessage: `Error Deleting Triton User. Failed to delete worker ${mockWorker.sid}`,
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
    test("deleteUser is called", () => {
      renderComponent();
      expect(StyledButton).toHaveBeenCalledTimes(2);
      const onClose = StyledButton.mock.calls[0][0].onClick;
      act(() => onClose());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});