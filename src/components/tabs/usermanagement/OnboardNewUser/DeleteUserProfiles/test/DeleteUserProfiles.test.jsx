import { DeleteTritonUser } from "../DeleteUserProfiles";
import { ForwardToEntryForm } from "usermanagement/ForwardToEntryForm";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useFormState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import React from "react";
import { terminateUser } from "services/terminateUser";
import {
  act,
  initialFormState,
  initialTestState,
  render,
  waitFor
} from "testUtils";

jest.mock("usermanagement/ForwardToEntryForm", () => ({
  ForwardToEntryForm: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("services/terminateUser", () => ({
  terminateUser: jest.fn()
}));

const mockFormDispatch = jest.fn();
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
    useAdminState.mockReturnValue(initialTestState);
    useFormDispatch.mockReturnValue(mockFormDispatch);
    useFormState.mockReturnValue({
      ...initialFormState,
      triton: {
        ...initialTestState.workerContext.workers[6],
        inactiveForwardTo: {
          value: ""
        },
        userFound: true,
        didUser: false
      },
      nNumber: {
        value: mockWorker.attributes.n_number
      }
    });
    terminateUser.mockResolvedValue("Yay!");
  });
  describe("initial render", () => {
    describe("worker is DID", () => {
      beforeEach(() => {
        useFormState.mockReturnValue({
          ...initialFormState,
          triton: {
            ...initialTestState.workerContext.workers[0],
            userFound: true,
            didUser: true,
            inactiveForwardTo: {
              value: ""
            }
          },
          nNumber: {
            value: mockWorker.attributes.n_number
          }
        });
      });
      test("component renders without ForwardToEntryForm", () => {
        const rendered = renderComponent();
        expect(rendered.container).toHaveTextContent("Confirm Delete to allow the system to identify the forward to option for this DID user.");
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(0);
        expect(StyledButton).toHaveBeenCalledTimes(3);
        expect(StyledButton.mock.calls[2][0].disabled).toBe(false);
      });
      describe("updateForwardTo is called", () => {
        test("inactiveForwardTo is set when delete is submitted", () => {
          renderComponent();
          const openForwardTo = StyledButton.mock.calls[0][0].onClick;
          act(() => openForwardTo());
          expect(ForwardToEntryForm).toHaveBeenCalledTimes(1);
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          act(() => updateForwardTo("callmebeepme"));
          expect(mockFormDispatch).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
            payload: "callmebeepme"
          });
          useFormState.mockReturnValue({
            ...initialFormState,
            triton: {
              ...initialTestState.workerContext.workers[0],
              userFound: true,
              didUser: true,
              inactiveForwardTo: {
                value: "callmebeepme"
              }
            },
            nNumber: {
              value: mockWorker.attributes.n_number
            }
          });

          expect(StyledButton).toHaveBeenCalledTimes(6);
          const confirmDelete = StyledButton.mock.calls[5][0].onClick;
          act(() => confirmDelete());
          expect(terminateUser).toHaveBeenCalledTimes(1);
        });
        test("inactiveForwardTo is cleared when delete is submitted", () => {
          renderComponent();
          const openForwardTo = StyledButton.mock.calls[0][0].onClick;
          act(() => openForwardTo());
          expect(ForwardToEntryForm).toHaveBeenCalledTimes(1);
          const updateForwardTo = ForwardToEntryForm.mock.calls[0][0].updateForwardTo;
          act(() => updateForwardTo(""));
          expect(StyledButton).toHaveBeenCalledTimes(6);
          expect(mockFormDispatch).toHaveBeenCalledWith({
            type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
            payload: ""
          });
          const confirmDelete = StyledButton.mock.calls[5][0].onClick;
          act(() => confirmDelete());
          expect(terminateUser).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe("worker is not DID", () => {
      test("component renders without ForwardToEntryForm", () => {
        renderComponent();
        expect(ForwardToEntryForm).toHaveBeenCalledTimes(0);
        expect(StyledButton).toHaveBeenCalledTimes(2);
        expect(StyledButton.mock.calls[1][0].disabled).toBe(false);
      });
    });
  });

  describe("handleDeleteUser is clicked", () => {
    describe("service call succeeds", () => {
      test("terminateUser is called", async () => {
        terminateUser.mockResolvedValueOnce("yay!");
        renderComponent();
        expect(StyledButton).toHaveBeenCalledTimes(2);
        const confirmDelete = StyledButton.mock.calls[1][0].onClick;
        act(() => confirmDelete());
        expect(terminateUser).toHaveBeenCalledTimes(1);
        expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
        expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
        jest.runAllTimers();
        await waitFor(() => {
          expect(mockUpdateLoading).toHaveBeenCalledTimes(3);
          expect(mockUpdateLoading).toHaveBeenCalledWith({
            overlayMessage: "Deleting user: Worker McGee",
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
        });
      });
    });
    describe("service call fails", () => {
      describe("unexpected error is thrown", () => {
        describe("error is a string", () => {
          beforeEach(() => {
            terminateUser.mockRejectedValue({
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
            expect(terminateUser).toHaveBeenCalledTimes(1);
            expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
            expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
            await waitFor(() => {
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                overlayMessage: "Deleting user: Worker McGee",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                overlayMessage: [<div>Failed to Terminate Worker. </div>],
                saveStatus: "fail",
                saveUser: true
              });
            });
          });
        });
        describe("error is an object", () => {
          beforeEach(() => {
            terminateUser.mockRejectedValue({
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
            expect(terminateUser).toHaveBeenCalledTimes(1);
            expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
            expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
            await waitFor(() => {
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                overlayMessage: "Deleting user: Worker McGee",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                overlayMessage: [<div>Failed to Terminate Worker. </div>],
                saveStatus: "fail",
                saveUser: true
              });
            });
          });
        });
      });
      describe("formatted error is thrown", () => {
        describe("not a forward to error", () => {
          describe("delete triton user succeeded", () => {
            beforeEach(() => {
              terminateUser.mockRejectedValue({
                response: {
                  data: {
                    error: {
                      results: [
                        {
                          body: JSON.stringify({ message: "Worker API Succeeded" }),
                          statusCode: 200
                        },
                        "WFM was bypassed",
                        {
                          body: JSON.stringify({ message: "QM deletion failed" }),
                          statusCode: 500
                        }
                      ]
                    }
                  }
                }
              });
            });
            test("errors are displayed and reset form is called with partial fail", async () => {
              renderComponent();
              expect(StyledButton).toHaveBeenCalledTimes(2);
              const confirmDelete = StyledButton.mock.calls[1][0].onClick;
              act(() => confirmDelete());
              expect(terminateUser).toHaveBeenCalledTimes(1);
              expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
              expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
              await waitFor(() => {
                expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  overlayMessage: "Deleting user: Worker McGee",
                  saveStatus: "saving",
                  saveUser: true
                });
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  overlayMessage: [
                    <div>Failed to Terminate Worker. </div>,
                    <div>Worker API Succeeded</div>,
                    <div>WFM was bypassed</div>,
                    <div>QM deletion failed</div>
                  ],
                  saveStatus: "partial fail",
                  saveUser: true
                });
              });
            });
          });
          describe("delete triton user failed", () => {
            beforeEach(() => {
              terminateUser.mockRejectedValue({
                response: {
                  data: {
                    error: {
                      results: [
                        {
                          body: JSON.stringify({ message: "Worker API Succeeded" }),
                          statusCode: 500
                        },
                        {
                          body: JSON.stringify({ message: "QM deletion failed" }),
                          statusCode: 500
                        }
                      ]
                    }
                  }
                }
              });
            });
            test("errors are displayed and reset form is called with partial fail", async () => {
              renderComponent();
              expect(StyledButton).toHaveBeenCalledTimes(2);
              const confirmDelete = StyledButton.mock.calls[1][0].onClick;
              act(() => confirmDelete());
              expect(terminateUser).toHaveBeenCalledTimes(1);
              expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
              expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
              await waitFor(() => {
                expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  overlayMessage: "Deleting user: Worker McGee",
                  saveStatus: "saving",
                  saveUser: true
                });
                expect(mockUpdateLoading).toHaveBeenCalledWith({
                  overlayMessage: [
                    <div>Failed to Terminate Worker. </div>,
                    <div>Worker API Succeeded</div>,
                    <div>QM deletion failed</div>
                  ],
                  saveStatus: "fail",
                  saveUser: true
                });
              });
            });
          });
        });
        describe("error is a forwardToFailure", () => {
          beforeEach(() => {
            useFormState.mockReturnValue({
              ...initialFormState,
              triton: {
                ...initialTestState.workerContext.workers[6],
                inactiveForwardTo: {
                  value: ""
                },
                userFound: true,
                didUser: true
              },
              nNumber: {
                value: mockWorker.attributes.n_number
              }
            });
            terminateUser.mockRejectedValue({
              response: {
                data: {
                  error: {
                    results: [
                      {
                        body: JSON.stringify({
                          message: "Worker API Succeeded",
                          forwardToFailure: true
                        }),
                        statusCode: 500
                      }
                    ]
                  }
                }
              }
            });
          });
          test("we return to form and forward to is rendered", async () => {
            const rendered = renderComponent();
            expect(StyledButton).toHaveBeenCalledTimes(3);
            expect(rendered.container).toHaveTextContent("Confirm Delete to allow the system to identify the forward to option for this DID user.");
            expect(StyledButton.mock.calls[0][0].children).toBe("Manually select forward to option");
            const confirmDelete = StyledButton.mock.calls[2][0].onClick;
            expect(ForwardToEntryForm).toHaveBeenCalledTimes(0);
            act(() => confirmDelete());
            expect(terminateUser).toHaveBeenCalledTimes(1);
            expect(terminateUser.mock.calls[0][0]).toEqual("Access Token");
            expect(terminateUser.mock.calls[0][1]).toEqual(expectedTerminatePayload);
            await waitFor(() => {
              expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                overlayMessage: "Deleting user: Worker McGee",
                saveStatus: "saving",
                saveUser: true
              });
              expect(mockUpdateLoading).toHaveBeenCalledWith({
                lookupUser: false,
                overlayMessage: "",
                saveStatus: null,
                saveUser: false
              });
              expect(rendered.container).not.toHaveTextContent("Confirm Delete to allow the system to identify the forward to option for this DID user.");
              expect(ForwardToEntryForm).toHaveBeenCalledTimes(2);
              expect(ForwardToEntryForm.mock.calls[1][0].label).toBe("The system failed to identify the DID's forward to option, please manually select it and try again.");
            });
          });
        });
      });
    });
  });
  describe("handleClose is called", () => {
    test("terminateUser is called", () => {
      renderComponent();
      expect(StyledButton).toHaveBeenCalledTimes(2);
      const onClose = StyledButton.mock.calls[0][0].onClick;
      act(() => onClose());
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });
});