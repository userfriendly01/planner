import CompareProfiles from "../CompareProfiles";
import MessageBanner from "../MessageBanner";
import ProfileColumn from "../ProfileColumn";
import ResetModal from "../ResetModal";
import {
  NNumberInput,
  StyledButton
} from "components";
import { useAdminState } from "context";
import React from "react";
import {
  getWfmTeam,
  getWfmUserByNNumber,
  getQmUserProfiles
} from "services";
import {
  act,
  render,
  initialTestState,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { Modal } from "@mui/material";
import { messageConsts } from "../messages";

jest.mock("components", () => ({
  ModalFetchingRing: jest.fn(),
  NNumberInput: jest.fn(),
  CalabrioGroup: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("../MessageBanner", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../ProfileColumn", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../ResetModal", () => ({
  __esModule: true,
  default: jest.fn()
}));

const testState = {
  ...initialTestState,
  userContext: {
    ...initialTestState.userContext,
    pingIdentity: {
      ...initialTestState.userContext.pingIdentity,
      environment: "test"
    }
  }
}

const productionState = {
  ...initialTestState,
  userContext: {
    ...initialTestState.userContext,
    pingIdentity: {
      ...initialTestState.userContext.pingIdentity,
      environment: "production"
    }
  }
}

const initiateResetProcess = (nNumber, fetchedUser) => {
  render(<CompareProfiles />);
  expect(NNumberInput).toHaveBeenCalledTimes(1);
  const onUpdate = NNumberInput.mock.calls[0][0].onUpdate;
  act(() => onUpdate(nNumber));
  const newValue = NNumberInput.mock.calls[1][0].value;
  expect(newValue).toBe(nNumber);
  const onComplete = NNumberInput.mock.calls[1][0].onComplete;
  act(() => onComplete(fetchedUser, nNumber));
  expect(NNumberInput).toHaveBeenCalledTimes(4);
  const fetchedUserValue = NNumberInput.mock.calls[3][0].fetchedUser;
  expect(fetchedUserValue).toBe(fetchedUser);
}

describe("CompareProfiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Modal,
      NNumberInput,
      StyledButton,
      ProfileColumn,
      MessageBanner
    });
    useAdminState.mockReturnValue(productionState)
  });
  describe("initial render", () => {
    describe("environment === development", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue(initialTestState);
      });
      test("renders as expected", () => {
        render(<CompareProfiles />);
        expect(NNumberInput).not.toHaveBeenCalled();
        expect(StyledButton).not.toHaveBeenCalled();
        expect(ProfileColumn).not.toHaveBeenCalled();
        expect(ResetModal).not.toHaveBeenCalled();
        expect(MessageBanner).toHaveBeenCalled();
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("environment", "development");
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("messages", []);
      });
    });
    describe("environment === test", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue(testState);
      });
      test("renders as expected", () => {
        render(<CompareProfiles />);
        expect(NNumberInput).toHaveBeenCalled();
        expect(StyledButton).not.toHaveBeenCalled();
        expect(ProfileColumn).not.toHaveBeenCalled();
        expect(ResetModal).not.toHaveBeenCalled();
        expect(MessageBanner).toHaveBeenCalled();
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("environment", "test");
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("messages", []);
      });
    });
    describe("environment === production", () => {
      beforeEach(() => {
        useAdminState.mockReturnValue(productionState);
      });
      test("renders as expected", () => {
        render(<CompareProfiles />);
        expect(NNumberInput).toHaveBeenCalled();
        expect(StyledButton).not.toHaveBeenCalled();
        expect(ProfileColumn).not.toHaveBeenCalled();
        expect(ResetModal).not.toHaveBeenCalled();
        expect(MessageBanner).toHaveBeenCalled();
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("environment", "production");
        expect(MessageBanner.mock.calls[0][0]).toHaveProperty("messages", []);
      });
    });
  });
  describe("invalid nNumber is entered", () => {
    test("nNumber value is updated but nothing additional is rendered", () => {
      render(<CompareProfiles />);
      expect(NNumberInput).toHaveBeenCalledTimes(1);
      const onUpdate = NNumberInput.mock.calls[0][0].onUpdate;
      act(() => onUpdate("n0264"));
      expect(NNumberInput).toHaveBeenCalledTimes(2);
      const newValue = NNumberInput.mock.calls[1][0].value;
      expect(newValue).toBe("n0264");
      expect(StyledButton).not.toHaveBeenCalled();
      expect(ProfileColumn).not.toHaveBeenCalled();
      expect(ResetModal).not.toHaveBeenCalled();
    });
  });
  describe("updateMessages", () => {
    const messageText1 = "I'm the first message!";
    const messageText2 = "I'm the second message!";
    const messageText3 = "I'm the third message!";
    describe("message is added", () => {
      test("message is added to the bottom of the array", () => {
        render(<CompareProfiles />);
        expect(MessageBanner).toHaveBeenCalledTimes(1);
        const updateMessages = MessageBanner.mock.calls[0][0].updateMessages;
        act(() => updateMessages("add", null, messageText1, "error"));
        expect(MessageBanner).toHaveBeenCalledTimes(2);
        const messages = MessageBanner.mock.calls[1][0].messages;
        expect(messages).toStrictEqual([{
          id: 0,
          level: "error",
          message: messageText1
        }]);
      });
    });
    describe("message is removed", () => {
      test("message is removed by index and remaining indexes are updated", () => {
        render(<CompareProfiles />);
        expect(MessageBanner).toHaveBeenCalledTimes(1);
        let updateMessages = MessageBanner.mock.calls[0][0].updateMessages;
        act(() => updateMessages("add", null, messageText1, "error"));
        expect(MessageBanner).toHaveBeenCalledTimes(2);
        updateMessages = MessageBanner.mock.calls[1][0].updateMessages;
        act(() => updateMessages("add", null, messageText2, "warning"));
        expect(MessageBanner).toHaveBeenCalledTimes(3);
        updateMessages = MessageBanner.mock.calls[2][0].updateMessages;
        act(() => updateMessages("add", null, messageText3, "info"));
        expect(MessageBanner).toHaveBeenCalledTimes(4);
        let messages = MessageBanner.mock.calls[3][0].messages;
        expect(messages).toStrictEqual([
          {
            id: 0,
            level: "error",
            message: messageText1
          },
          {
            id: 1,
            level: "warning",
            message: messageText2
          },
          {
            id: 2,
            level: "info",
            message: messageText3
          }
        ]);
        updateMessages = MessageBanner.mock.calls[3][0].updateMessages;
        act(() => updateMessages("delete", 1));
        messages = MessageBanner.mock.calls[4][0].messages;
        expect(messages).toStrictEqual([
          {
            id: 0,
            level: "error",
            message: messageText1
          },
          {
            id: 1,
            level: "info",
            message: messageText3
          }
        ]);
      });
    });
  });
  describe("valid nNumber is entered", () => {
    describe("fetch Profiles", () => {
      describe("multiple triton profiles are found", () => {
        const multipleTritonState = {
          ...productionState,
          workerContext: {
            workers: [
              productionState.workerContext.workers[0],
              productionState.workerContext.workers[0],
              productionState.workerContext.workers[1]
            ]
          }
        }
        beforeEach(() => {
          useAdminState.mockReturnValue(multipleTritonState);
        });
        test("updateMessages is called - process does not continue", () => {
          const worker = productionState.workerContext.workers[0];
          const fetchedUser = { email: worker.attributes.email };
          initiateResetProcess(worker.attributes.n_number, fetchedUser);
          expect(StyledButton).not.toHaveBeenCalled();
          expect(ProfileColumn).not.toHaveBeenCalled();
          expect(ResetModal).not.toHaveBeenCalled();
          expect(MessageBanner).toHaveBeenCalledTimes(4);
          expect(MessageBanner.mock.calls[3][0].messages).toStrictEqual([{
            id: 0,
            level: "error",
            message: messageConsts.MULTIPLE_TRITON_PROFILES
          }]);
        });
      });
      describe("no triton profile is found", () => {
        const noTritonState = {
          ...productionState,
          workerContext: {
            workers: [
              productionState.workerContext.workers[1]
            ]
          }
        }
        beforeEach(() => {
          useAdminState.mockReturnValue(noTritonState);
        });
        test("updateMessages is called - process does not continue", () => {
          const worker = productionState.workerContext.workers[0];
          const fetchedUser = { email: worker.attributes.email };
          initiateResetProcess(worker.attributes.n_number, fetchedUser);
          expect(StyledButton).not.toHaveBeenCalled();
          expect(ProfileColumn).not.toHaveBeenCalled();
          expect(ResetModal).not.toHaveBeenCalled();
          expect(MessageBanner).toHaveBeenCalledTimes(4);
          expect(MessageBanner.mock.calls[3][0].messages).toStrictEqual([{
            id: 0,
            level: "error",
            message: messageConsts.MISSING_TRITON_PROFILE
          }]);
        });
      });
      describe("one triton profile is found", () => {
        describe("no Master QM profile is found", () => {
          beforeEach(() => {
            useAdminState.mockReturnValue(testState);
            getQmUserProfiles.mockResolvedValue({})
          });
          test("messages are updated, triton and qm profiles are displayed, no reset button is rendered", async () => {
            const worker = productionState.workerContext.workers[0];
            const fetchedUser = { email: worker.attributes.email };
            initiateResetProcess(worker.attributes.n_number, fetchedUser);
            await waitFor(() => {
              expect(MessageBanner.mock.calls.length).toBe(6);
              expect(MessageBanner.mock.calls[5][0].messages).toStrictEqual([{
                id: 0,
                level: "error",
                message: messageConsts.MISSING_CALABRIO_MASTER_PROFILE
              }]);
              expect(StyledButton).not.toHaveBeenCalled();
              expect(ResetModal).not.toHaveBeenCalled();
              expect(ProfileColumn).toHaveBeenCalledTimes(2);
            });
          });
        });
        describe("master profile was found", () => {
          describe("environment === production", () => {
            const wfmResponse = {
              Id: "32187-68465-11210-46582",
              EmploymentNumber: "n0263786",
              Identity: "Faith.Cuneo@libertymutual.com",
              Email: "Faith.Cuneo@libertymutual.com",
              FirstName: "Faith",
              LastName: "Cuneo",
              TeamId: "TEAMMMM",
              BusinessUnitId: "123-321"
            };
            beforeEach(() => {
              useAdminState.mockReturnValue(productionState);
              getQmUserProfiles.mockResolvedValue({
                data: [{
                  id: 210,
                  acdId: productionState.workerContext.workers[0].sid,
                  adLogin: "LM\\n0263786",
                  email: "faith.cuneo@libertymutual.com",
                  firstName: "Faith",
                  lastName: "Cuneo",
                  groupId: 101,
                  isSynchronized: true,
                  deactivated: 32503593600000
                }]
              })
            });
            describe("error thrown fetching wfm user", () => {
              describe("error.message", () => {
                beforeEach(() => {
                  getWfmUserByNNumber.mockRejectedValue({ message: "AWW WFM" });
                });
                test("process is cancelled, error is added to messages", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(MessageBanner.mock.calls.length).toBe(5);
                    expect(MessageBanner.mock.calls[4][0].messages).toStrictEqual([{
                      id: 0,
                      level: "error",
                      message: "An Error was thrown trying to fetch this users profiles: AWW WFM"
                    }]);
                    expect(StyledButton).not.toHaveBeenCalled();
                    expect(ResetModal).not.toHaveBeenCalled();
                    expect(ProfileColumn).not.toHaveBeenCalled();
                  });
                });
              });
              describe("error.response.message", () => {
                beforeEach(() => {
                  getWfmUserByNNumber.mockRejectedValue({
                    response: {
                      message: "AWW WFM"
                    }
                  });
                });
                test("process is cancelled, error is added to messages", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(MessageBanner.mock.calls.length).toBe(5);
                    expect(MessageBanner.mock.calls[4][0].messages).toStrictEqual([{
                      id: 0,
                      level: "error",
                      message: "An Error was thrown trying to fetch this users profiles: AWW WFM"
                    }]);
                    expect(StyledButton).not.toHaveBeenCalled();
                    expect(ResetModal).not.toHaveBeenCalled();
                    expect(ProfileColumn).not.toHaveBeenCalled();
                  });
                });
              });
              describe("error", () => {
                beforeEach(() => {
                  getWfmUserByNNumber.mockRejectedValue("AWW WFM");
                });
                test("process is cancelled, error is added to messages", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(MessageBanner.mock.calls.length).toBe(5);
                    expect(MessageBanner.mock.calls[4][0].messages).toStrictEqual([{
                      id: 0,
                      level: "error",
                      message: "An Error was thrown trying to fetch this users profiles: AWW WFM"
                    }]);
                    expect(StyledButton).not.toHaveBeenCalled();
                    expect(ResetModal).not.toHaveBeenCalled();
                    expect(ProfileColumn).not.toHaveBeenCalled();
                  });
                });
              });
            });
            describe("wfm user fetched successfully", () => {
              describe("no WFM user found", () => {
                beforeEach(() => {
                  getWfmUserByNNumber.mockResolvedValue({
                    data: {
                      Result: []
                    }
                  });
                });
                test("process should continue, 2 columns rendered, messages added", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
                    expect(getQmUserProfiles).toHaveBeenCalledTimes(1);
                    expect(MessageBanner.mock.calls.length).toBe(8);
                    expect(MessageBanner.mock.calls[7][0].messages).toStrictEqual([{
                      id: 0,
                      level: "warning",
                      message: messageConsts.WFM_NO_PROFILE_FOUND
                    }]);
                    expect(StyledButton).toHaveBeenCalledTimes(2);
                    expect(ProfileColumn).toHaveBeenCalledTimes(2);
                    expect(ResetModal).not.toHaveBeenCalled();
                  });
                });
              });
              describe("multiple WFM users were returned", () => {
                beforeEach(() => {
                  getWfmUserByNNumber.mockResolvedValue({
                    data: {
                      Result: [wfmResponse, { Id: "33332-55554-8889-11112" }]
                    }
                  });
                });
                test("process should continue, 3 columns rendered, messages added", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
                    expect(getQmUserProfiles).toHaveBeenCalledTimes(1);
                    expect(MessageBanner.mock.calls.length).toBe(8);
                    expect(MessageBanner.mock.calls[7][0].messages).toStrictEqual([{
                      id: 0,
                      level: "error",
                      message: `${messageConsts.WFM_MULTIPLE_PROFILES} Person Ids: ${JSON.stringify(["32187-68465-11210-46582", "33332-55554-8889-11112"])}`
                    }]);
                    expect(StyledButton).toHaveBeenCalledTimes(2);
                    expect(ProfileColumn).toHaveBeenCalledTimes(2);
                    expect(ResetModal).not.toHaveBeenCalled();
                  });
                });
              });
              describe("One WFM user was returned - Entire Process is successful", () => {
                const detailedWorkerState = {
                  ...productionState,
                  workerContext: {
                    workers: [{
                      ...productionState.workerContext.workers[0],
                      attributes: {
                        ...productionState.workerContext.workers[0].attributes,
                        manager_first_name: "Larry",
                        manager_last_name: "Bird",
                        email: "Faith.cuneo@libertymutual.com"
                      }
                    }]
                  }
                }
                beforeEach(() => {
                  useAdminState.mockReturnValue(detailedWorkerState);
                  getWfmUserByNNumber.mockResolvedValue({
                    data: {
                      Result: [wfmResponse]
                    }
                  });
                });
                test("process should continue, 3 columns rendered, messages added", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
                    expect(getQmUserProfiles).toHaveBeenCalledTimes(1);
                    expect(StyledButton).toHaveBeenCalledTimes(2);
                    expect(ProfileColumn).toHaveBeenCalledTimes(3);
                    expect(ResetModal).not.toHaveBeenCalled();
                    expect(ProfileColumn.mock.calls[0][0]).toStrictEqual({
                      title: "Triton",
                      people: [{
                        "Active": true,
                        "Email": "Faith.cuneo@libertymutual.com",
                        "First Name": "Faith",
                        "Last Name": "Cuneo",
                        "Manager First Name": "Larry",
                        "Manager Last Name": "Bird",
                        "Manager N Number": "n023356",
                        "N Number": "N0263786",
                        "Profile Id": "12",
                        "Profile Name": "test5",
                        "Worker Sid": "wk049358"
                      }]
                    });
                    expect(ProfileColumn.mock.calls[1][0]).toStrictEqual({
                      title: "Calabrio QM",
                      people: [{
                        "Acd Id": "wk049358",
                        "Active": true,
                        "Ad Login": "LM\\n0263786",
                        "Email": "faith.cuneo@libertymutual.com",
                        "First Name": "Faith",
                        "Last Name": "Cuneo",
                        "Team": "Hawaii Team 50",
                        "User Id": 210
                      }]
                    });
                    expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                      title: "Calabrio WFM",
                      people: [{
                        "Active": true,
                        "Business Unit Id": "Cool WFM Business Unit",
                        "Email": "Faith.Cuneo@libertymutual.com",
                        "Employment Number": "n0263786",
                        "First Name": "Faith",
                        "Identity": "Faith.Cuneo@libertymutual.com",
                        "Last Name": "Cuneo",
                        "Person Id": "32187-68465-11210-46582",
                        "Team Id": "TEAMMMM"
                      }]
                    });
                  });
                });
                describe("Team name is fetched for WFM worker", () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  describe("Team exists in state already", () => {
                    test("should not call getWfmTeam", async () => {
                      getWfmUserByNNumber.mockResolvedValue({
                        data: {
                          Result: [{
                            ...wfmResponse,
                            TeamId: "111"
                          }]
                        }
                      });
                      initiateResetProcess(worker.attributes.n_number, fetchedUser);
                      await waitFor(() => {
                        expect(getWfmTeam).not.toHaveBeenCalled();
                        expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                          title: "Calabrio WFM",
                          people: [{
                            "Active": true,
                            "Business Unit Id": "Cool WFM Business Unit",
                            "Email": "Faith.Cuneo@libertymutual.com",
                            "Employment Number": "n0263786",
                            "First Name": "Faith",
                            "Identity": "Faith.Cuneo@libertymutual.com",
                            "Last Name": "Cuneo",
                            "Person Id": "32187-68465-11210-46582",
                            "Team Id": "Team1"
                          }]
                        });
                      });
                    });
                  });
                  describe("Team does not exist in state already", () => {
                    describe("Team is returned successfully from getWfmTeam", () => {
                      test("should set Team Name from results", async () => {
                        getWfmTeam.mockResolvedValue({
                          data: {
                            Result: [{
                              Name: "Returned Name",
                              Id: "111"
                            }]
                          }
                        });
                        initiateResetProcess(worker.attributes.n_number, fetchedUser);
                        await waitFor(() => {
                          expect(getWfmTeam).toHaveBeenCalledTimes(1);
                          expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                            title: "Calabrio WFM",
                            people: [{
                              "Active": true,
                              "Business Unit Id": "Cool WFM Business Unit",
                              "Email": "Faith.Cuneo@libertymutual.com",
                              "Employment Number": "n0263786",
                              "First Name": "Faith",
                              "Identity": "Faith.Cuneo@libertymutual.com",
                              "Last Name": "Cuneo",
                              "Person Id": "32187-68465-11210-46582",
                              "Team Id": "Returned Name"
                            }]
                          });
                        });
                      });
                    });
                    describe("Empty results are returned from getWfmTeam", () => {
                      test("should set Team Id as Team Name", async () => {
                        getWfmTeam.mockResolvedValue({
                          data: {
                            Result: []
                          }
                        });
                        initiateResetProcess(worker.attributes.n_number, fetchedUser);
                        await waitFor(() => {
                          expect(getWfmTeam).toHaveBeenCalledTimes(1);
                          expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                            title: "Calabrio WFM",
                            people: [{
                              "Active": true,
                              "Business Unit Id": "Cool WFM Business Unit",
                              "Email": "Faith.Cuneo@libertymutual.com",
                              "Employment Number": "n0263786",
                              "First Name": "Faith",
                              "Identity": "Faith.Cuneo@libertymutual.com",
                              "Last Name": "Cuneo",
                              "Person Id": "32187-68465-11210-46582",
                              "Team Id": "TEAMMMM"
                            }]
                          });
                        });
                      });
                    });
                    describe("Error is thrown from getWfmTeam", () => {
                      test("should set Team Id as Team Name", async () => {
                        getWfmTeam.mockRejectedValue("aww");
                        initiateResetProcess(worker.attributes.n_number, fetchedUser);
                        await waitFor(() => {
                          expect(getWfmTeam).toHaveBeenCalledTimes(1);
                          expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                            title: "Calabrio WFM",
                            people: [{
                              "Active": true,
                              "Business Unit Id": "Cool WFM Business Unit",
                              "Email": "Faith.Cuneo@libertymutual.com",
                              "Employment Number": "n0263786",
                              "First Name": "Faith",
                              "Identity": "Faith.Cuneo@libertymutual.com",
                              "Last Name": "Cuneo",
                              "Person Id": "32187-68465-11210-46582",
                              "Team Id": "TEAMMMM"
                            }]
                          });
                        });
                      });
                    });
                  });
                  describe("Business Unit or Team Id isnt valid to identify Team Name", () => {
                    test("should set Team Id as Team Name", () => {

                    });
                  })
                });
              });
              describe("Users have no details", () => {
                const noDetailWorkerState = {
                  ...productionState,
                  workerContext: {
                    workers: [{
                      sid: productionState.workerContext.workers[0].sid,
                      attributes: {
                        n_number: productionState.workerContext.workers[0].attributes.n_number,
                      }
                    }]
                  }
                }
                beforeEach(() => {
                  useAdminState.mockReturnValue(noDetailWorkerState);
                  getQmUserProfiles.mockResolvedValue({
                    data: [
                      {
                        id: 210,
                        acdId: productionState.workerContext.workers[0].sid,
                        isSynchronized: true
                      },
                      {
                        id: 205,
                      }
                    ]
                  })
                  getWfmUserByNNumber.mockResolvedValue({
                    data: {
                      Result: [{}]
                    }
                  });
                });
                test("process should continue, 3 columns rendered, messages added", async () => {
                  const worker = productionState.workerContext.workers[0];
                  const fetchedUser = { email: worker.attributes.email };
                  initiateResetProcess(worker.attributes.n_number, fetchedUser);
                  await waitFor(() => {
                    expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
                    expect(getQmUserProfiles).toHaveBeenCalledTimes(1);
                    expect(StyledButton).toHaveBeenCalledTimes(2);
                    expect(ProfileColumn).toHaveBeenCalledTimes(3);
                    expect(ResetModal).not.toHaveBeenCalled();
                    expect(ProfileColumn.mock.calls[0][0]).toStrictEqual({
                      title: "Triton",
                      people: [{
                        "Active": true,
                        "Email": "",
                        "First Name": "",
                        "Last Name": "",
                        "Manager First Name": "",
                        "Manager Last Name": "",
                        "Manager N Number": "",
                        "N Number": "N0263786",
                        "Profile Id": "",
                        "Profile Name": "",
                        "Worker Sid": "wk049358"
                      }]
                    });
                    expect(ProfileColumn.mock.calls[1][0]).toStrictEqual({
                      title: "Calabrio QM",
                      people: [
                        {
                          "Acd Id": "wk049358",
                          "Active": false,
                          "Ad Login": "",
                          "Email": "",
                          "First Name": "",
                          "Last Name": "",
                          "Team": "Not Found",
                          "User Id": 210
                        },
                        {
                          "Acd Id": "",
                          "Active": false,
                          "Ad Login": "",
                          "Email": "",
                          "First Name": "",
                          "Last Name": "",
                          "Team": "Not Found",
                          "User Id": 205
                        }
                      ]
                    });
                    expect(ProfileColumn.mock.calls[2][0]).toStrictEqual({
                      title: "Calabrio WFM",
                      people: [{
                        "Active": true,
                        "Business Unit Id": "",
                        "Email": "",
                        "Employment Number": "",
                        "First Name": "",
                        "Identity": "",
                        "Last Name": "",
                        "Person Id": "",
                        "Team Id": ""
                      }]
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  describe("ResetModal", () => {
    beforeEach(() => {
      useAdminState.mockReturnValue(productionState);
      getQmUserProfiles.mockResolvedValue({
        data: [{
          id: 210,
          acdId: productionState.workerContext.workers[0].sid,
          isSynchronized: true
        }]
      })
      getWfmUserByNNumber.mockResolvedValue({
        data: {
          Result: [{ Id: "2341-1243" }]
        }
      });
    });
    describe("ResetSkills button is clicked", () => {
      test("open === true, when closed = open === false", async () => {
        const worker = productionState.workerContext.workers[0];
        const fetchedUser = { email: "faith.cuneo@libertymutual.com" };
        initiateResetProcess(worker.attributes.n_number, fetchedUser);
        await waitFor(async () => {
          expect(getWfmUserByNNumber).toHaveBeenCalledTimes(1);
          expect(getQmUserProfiles).toHaveBeenCalledTimes(1);
        });
        expect(ProfileColumn).toHaveBeenCalledTimes(3);
        expect(ResetModal).not.toHaveBeenCalled();
        const onClick = StyledButton.mock.calls[1][0].onClick;
        act(() => onClick());
        expect(Modal.mock.calls.length).toBe(9);
        expect(Modal.mock.calls[8][0].open).toBe(true);
        const modalOnClose = Modal.mock.calls[8][0].onClose;
        act(() => modalOnClose());
        render(Modal.mock.calls[8][0].children);
        expect(ResetModal).toHaveBeenCalledTimes(1);
        expect(ResetModal.mock.calls[0][0]).toHaveProperty("nNumber", "N0263786");
        expect(ResetModal.mock.calls[0][0]).toHaveProperty("email", "faith.cuneo@libertymutual.com");
        expect(ResetModal.mock.calls[0][0]).toHaveProperty("workerSid", "wk049358");
        expect(ResetModal.mock.calls[0][0]).toHaveProperty("wfmPersonId", "2341-1243");
        const onClose = ResetModal.mock.calls[0][0].onClose;
        act(() => onClose());
        expect(Modal.mock.calls.length).toBe(10);
        expect(Modal.mock.calls[9][0].open).toBe(false);
        expect(NNumberInput.mock.calls.length).toBe(10);
        expect(NNumberInput.mock.calls[9][0].fetchedUser).toBe(null);
      });
    });
  })
});