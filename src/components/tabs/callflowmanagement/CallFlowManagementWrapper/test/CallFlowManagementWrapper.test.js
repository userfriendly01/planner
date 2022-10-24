import React from "react";
import CallFlowManagementWrapper from "../CallFlowManagementWrapper";
import { views } from "../CallFlowManagement.Interfaces";
import { getAuthenticationProfileTemplates } from "authentication";
import {
  CallFlowConfirmationModal,
  Dropdown,
  ActionContainer,
  SkillsContainer
} from "components";
import { useAdminState } from "context";
import {
  skillsList,
  render,
  getLastInstanceCalled,
  expectOnlyPassedProps,
  setupMockedComponents,
  initialTestState,
  act,
  authenticationProfileTemplates
} from "testUtils";
import { Modal } from "@mui/material";

jest.mock("components", () => ({
  CallFlowConfirmationModal: jest.fn(),
  Dropdown: jest.fn(),
  ActionContainer: jest.fn(),
  SkillsContainer: jest.fn()
}));

jest.mock("components", () => ({
  CallFlowConfirmationModal: jest.fn(),
  Dropdown: jest.fn(),
  ActionContainer: jest.fn(),
  SkillsContainer: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const initialTableState = {
  closedFilter: false,
  filteredList: [skillsList[2], skillsList[3]],
  flashFilter: false,
  profiles: [],
  searchBy: "",
  selected: []
};

const confirmationModalOpts = {
  open: false,
  exportButton: false,
  confirmationText: "",
  callbackMethods: {
    onConfirm: null,
    handleClose: null
  }
};

describe("CallFlowManagementWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthenticationProfileTemplates.mockReturnValue(authenticationProfileTemplates);
    useAdminState.mockReturnValue({
      ...initialTestState,
      userContext: {
        ...initialTestState.userContext,
        authenticationProfiles: [
          {
            ...initialTestState.userContext.authenticationProfiles[0],
            isAdmin: true,
            profileId: 0
          }
        ]
      }
    });
    setupMockedComponents({
      CallFlowConfirmationModal,
      Dropdown,
      ActionContainer,
      SkillsContainer,
      Modal
    });
  });
  describe("initial render", () => {
    beforeEach(() => {
      useAdminState.mockReturnValue(initialTestState);
    });
    test("initial form renders as expected", () => {
      render(<CallFlowManagementWrapper />);
      expectOnlyPassedProps(SkillsContainer, {
        tableState: initialTableState
      }, getLastInstanceCalled(SkillsContainer));
      expectOnlyPassedProps(ActionContainer, {
        confirmationModalOpts
      }, getLastInstanceCalled(ActionContainer));
      expectOnlyPassedProps(Dropdown, {
        label: "What would you like to do?",
        value: views.SKILLS,
        options: Object.values(views)
      }, getLastInstanceCalled(Dropdown));
      expectOnlyPassedProps(Modal, {
        open: false
      }, getLastInstanceCalled(Modal));
    });
  });
  describe("list is filtered", () => {
    describe("Filter By Profile", () => {
      describe("User is not admin", () => {
        describe("userProfileId matches skill profiles", () => {
          beforeEach(() => {
            useAdminState.mockReturnValue(initialTestState);
          });
          test("filtered list is set to only skills with profiles matching userProfileId", () => {
            render(<CallFlowManagementWrapper />);
            expectOnlyPassedProps(SkillsContainer, {
              tableState: initialTableState
            }, getLastInstanceCalled(SkillsContainer));
          });
        });
        describe("no match found in skills profile for userProfileId", () => {
          beforeEach(() => {
            useAdminState.mockReturnValue({
              ...initialTestState,
              userContext: {
                ...initialTestState.userContext,
                authenticationProfiles: [
                  {
                    ...initialTestState.userContext.authenticationProfiles[0],
                    isAdmin: false,
                    profileId: 13
                  }
                ]
              }
            });
          });
          test("filtered list is set to an empty array", () => {
            render(<CallFlowManagementWrapper />);
            expectOnlyPassedProps(SkillsContainer, {
              tableState: {
                ...initialTableState,
                filteredList: []
              }
            }, getLastInstanceCalled(SkillsContainer));
          });
        });
      });
      describe("User is Admin", () => {
        describe("no profiles are set on tableState", () => {
          test("filtered list is equal to full skills state", () => {
            render(<CallFlowManagementWrapper />);
            expectOnlyPassedProps(SkillsContainer, {
              tableState: {
                ...initialTableState,
                filteredList: skillsList
              }
            }, getLastInstanceCalled(SkillsContainer));
          });
        });
        describe("profiles are set on tableState", () => {
          test("filtered list is equal to full skills state", () => {
            render(<CallFlowManagementWrapper />);
            const tableState = SkillsContainer.mock.calls[0][0].tableState;
            const setTableState = SkillsContainer.mock.calls[0][0].setTableState;
            act(() => {
              setTableState({
                ...tableState,
                profiles: [{
                  name: "AISG",
                  profile_id: 4
                }]
              });
            });
            expectOnlyPassedProps(SkillsContainer, {
              tableState: {
                ...initialTableState,
                profiles: [{
                  name: "AISG",
                  profile_id: 4
                }],
                filteredList: [skillsList[1]]
              }
            }, getLastInstanceCalled(SkillsContainer));
          });
        });
      });
    });
    describe("Filter by Searchby", () => {
      test("filtered list only includes skills where name contains text search", () => {
        render(<CallFlowManagementWrapper />);
        const tableState = SkillsContainer.mock.calls[0][0].tableState;
        const setTableState = SkillsContainer.mock.calls[0][0].setTableState;
        act(() => {
          setTableState({
            ...tableState,
            searchBy: "bsc"
          });
        });
        expectOnlyPassedProps(SkillsContainer, {
          tableState: {
            ...initialTableState,
            searchBy: "bsc",
            filteredList: [skillsList[2], skillsList[3]]
          }
        }, getLastInstanceCalled(SkillsContainer));
      });
    });
    describe("Filter by Closed Filter", () => {
      test("filtered list only includes skill with a closed message", () => {
        render(<CallFlowManagementWrapper />);
        const tableState = SkillsContainer.mock.calls[0][0].tableState;
        const setTableState = SkillsContainer.mock.calls[0][0].setTableState;
        act(() => {
          setTableState({
            ...tableState,
            closedFilter: true
          });
        });
        expectOnlyPassedProps(SkillsContainer, {
          tableState: {
            ...initialTableState,
            closedFilter: true,
            filteredList: [skillsList[1], skillsList[2]]
          }
        }, getLastInstanceCalled(SkillsContainer));
      });
    });

    describe("Filter by Flash Filter", () => {
      test("filtered list only includes skill with a flash message", () => {
        render(<CallFlowManagementWrapper />);
        const tableState = SkillsContainer.mock.calls[0][0].tableState;
        const setTableState = SkillsContainer.mock.calls[0][0].setTableState;
        act(() => {
          setTableState({
            ...tableState,
            flashFilter: true
          });
        });
        expectOnlyPassedProps(SkillsContainer, {
          tableState: {
            ...initialTableState,
            flashFilter: true,
            filteredList: [skillsList[2]]
          }
        }, getLastInstanceCalled(SkillsContainer));
      });
    });
  });
  describe("view is changed", () => {
    //No other options to change to at this time - shell for a future test
  });
  describe("confirmationModalOpts.open === true", () => {
    test("CallFlowConfirmationModal should be rendered", () => {
      render(<CallFlowManagementWrapper />);
      const modalOpts = ActionContainer.mock.calls[0][0].confirmationModalOpts;
      const setModalOpts = ActionContainer.mock.calls[0][0].setConfirmationModalOpts;
      act(() => {
        setModalOpts({
          ...modalOpts,
          open: true
        });
      });
      render(Modal.mock.calls[2][0].children);
      expect(CallFlowConfirmationModal.mock.calls.length).toBe(1);
      expectOnlyPassedProps(CallFlowConfirmationModal, {
        confirmationModalOpts: {
          ...confirmationModalOpts,
          open: true
        },
        saveResult: {
          message: null,
          status: null
        }
      }, getLastInstanceCalled(CallFlowConfirmationModal));
    });
  });
});