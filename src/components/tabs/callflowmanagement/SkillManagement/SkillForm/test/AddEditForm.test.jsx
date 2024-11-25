import React from "react";
import { AddEditForm }from "../AddEditForm";
import {
  expectOnlyPassedProps,
  initialSkillState,
  initialTestState,
  mockSkillFormState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { CallflowSkillForm } from "callflowmanagement/CallflowSkillForm";
import { GeneralSkillForm } from "callflowmanagement/GeneralSkillForm";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import { Tab } from "@mui/material";
import {
  useAdminState,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import {
  skillActions
} from "context/reducers/skillReducer";
import {
  createSkill, updateSkill
} from "services/skill";
import {
  areVhFieldsValid, isSkillFormValid, getSkillFormChanges
} from "utils/skillsUtils";
import { ActionTypes } from "../../Skills.Interfaces";

jest.mock("@mui/material", () => ({
  Tab: jest.fn(),
  Tabs: jest.requireActual("@mui/material").Tabs,
  Divider: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useSkillState: jest.fn(),
  useSkillDispatch: jest.fn()
}));

jest.mock("callflowmanagement/CallflowSkillForm", () => ({
  CallflowSkillForm: jest.fn()
}));

jest.mock("callflowmanagement/GeneralSkillForm", () => ({
  GeneralSkillForm: jest.fn()
}));

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("services/skill", () => ({
  createSkill: jest.fn(),
  updateSkill: jest.fn()
}));

jest.mock("utils/skillsUtils", () => ({
  areVhFieldsValid: jest.fn(),
  isSkillFormValid: jest.fn(),
  getSkillFormChanges: jest.fn()
}));

const error = "Aww";
const success = "Yay!";
const mockCloseModal = jest.fn();
const mockSetAction = jest.fn();
const mockSkillDispatch = jest.fn();

jest.useFakeTimers();

const renderComponent = () => {
  return render(<AddEditForm
    action={ActionTypes.ADD}
    tableState={{
      selected: []
    }}
    closeModal={mockCloseModal}
    setAction={mockSetAction}
  />);
};

describe("<AddEditForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useSkillState.mockReturnValue(initialSkillState);
    useSkillDispatch.mockReturnValue(mockSkillDispatch);
    setupMockedComponents({
      CallflowSkillForm,
      GeneralSkillForm,
      ModalOverlay,
      StyledButton
    });
  });
  describe("ActionType === Add", () => {
    describe("initial render", () => {
      describe("default tab", () => {
        test("should render GeneralSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          expect(Tab.mock.calls[0][0].label).toBe("General Skill Settings");
          expect(Tab.mock.calls[1][0].label).toBe("Dynamic Routing");
          expect(Tab.mock.calls[2][0].label).toBe("Legacy Callflow Database");
          expect(rendered.container).toHaveTextContent("Please review all tabs for required * fields");
          expect(StyledButton).toHaveBeenCalledTimes(2);
          expect(StyledButton.mock.calls[1][0].disabled).toBe(true);
        });
      });
      describe("dynamic routing tab is clicked", () => {
        test("should render dynamic routing message", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[1][0].onClick;
          changeTab();
          expect(rendered.container).toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
        });
      });
      describe("legacy callflow tab is clicked", () => {
        test("should render CallflowSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[2][0].onClick;
          changeTab();
          expect(CallflowSkillForm).toHaveBeenCalledTimes(1);
        });
      });
      describe("we return to the general tab", () => {
        test("should render CallflowSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[1][0].onClick;
          changeTab();
          expect(rendered.container).toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          const changeBack = Tab.mock.calls[0][0].onClick;
          changeBack();
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
        });
      });
    });
    describe("submit button is clicked", () => {
      describe("vh fields are not valid", () => {
        test("early return, form remains as is", () => {
          areVhFieldsValid.mockReturnValue(false);
          renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(1);
          expect(mockSkillDispatch).not.toHaveBeenCalled();
        });
      });
      describe("vh fields are valid", () => {
        beforeEach(() => {
          isSkillFormValid.mockReturnValue(true);
          areVhFieldsValid.mockReturnValue(true);
          createSkill.mockResolvedValue({
            status: 200,
            messages: [success]
          });
        });
        describe("all service calls are successful", () => {
          test("form rerenders when saving and succeded", async () => {
            renderComponent();
            const submit = StyledButton.mock.calls[1][0].onClick;
            submit();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Processing...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Skill Successfully Created",
              status: "success"
            }, 1);
            jest.runAllTimers();
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.RESET_FORM
            });
            expect(mockSetAction).toHaveBeenCalledWith(null);
          });
        });
        describe("partial error is thrown creating new skill", () => {
          beforeEach(() => {
            createSkill.mockResolvedValue({
              status: 206,
              messages: [error]
            });
            useSkillState.mockReturnValue({
              ...initialSkillState,
              skillForm: {
                ...initialSkillState.skillForm,
                taskQueue: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true
                }
              }
            });
          });
          test("error messages are displayed", async () => {
            const rendered = renderComponent();
            const submit = StyledButton.mock.calls[1][0].onClick;
            submit();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Processing...",
              status: "saving"
            }, 0);
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.RESET_FORM
            });
            jest.runAllTimers();
            expect(rendered.container).toHaveTextContent("The following errors were thrown");
            expect(rendered.container).toHaveTextContent(error);
          });
          describe("close button is clicked", () => {
            test("close modal and skill dispatch are called", async () => {
              const rendered = renderComponent();
              const submit = StyledButton.mock.calls[1][0].onClick;
              submit();
              await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
              expectOnlyPassedProps(ModalOverlay, {
                message: "Processing...",
                status: "saving"
              }, 0);
              expect(mockSkillDispatch).toHaveBeenCalledWith({
                type: skillActions.RESET_FORM
              });
              jest.runAllTimers();
              expect(rendered.container).toHaveTextContent("The following errors were thrown");
              const closeModal = StyledButton.mock.calls[4][0].onClick;
              closeModal();
              expect(mockCloseModal).toHaveBeenCalled();
              expect(mockSkillDispatch).toHaveBeenCalledWith({ type: skillActions.RESET_FORM });
            });
          });
        });
        describe("full error is thrown creating new skill", () => {
          test("error messages are displayed", async () => {
            createSkill.mockRejectedValue(error);
            renderComponent();
            const submit = StyledButton.mock.calls[1][0].onClick;
            submit();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Processing...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Failed to Create Skill: Aww",
              status: "fail"
            }, 1);
          });
        });
        describe("refresh state error is thrown", () => {
          test("Success is still rendered", async () => {
            useSkillState.mockReturnValue({
              ...initialSkillState,
              skillForm: {
                ...initialSkillState.skillForm,
                taskQueue: {
                  ...initialSkillState.skillForm.taskQueue,
                  isNew: true
                }
              }
            });
            renderComponent();
            const submit = StyledButton.mock.calls[1][0].onClick;
            submit();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Processing...",
              status: "saving"
            }, 0);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Skill Successfully Created",
              status: "success"
            }, 1);
            jest.runAllTimers();
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.RESET_FORM
            });
            expect(mockSetAction).toHaveBeenCalledWith(null);
          });
        });
      });
    });
  });

  describe("ActionType === Edit", () => {
    const skill = "bscCbsL2";

    const renderComponent = selected => {
      return render(<AddEditForm
        action={ActionTypes.EDIT}
        tableState={{
          selected: selected || [skill]
        }}
        closeModal={mockCloseModal}
        setAction={mockSetAction}
      />);
    };

    beforeEach(() => {
      jest.clearAllMocks(),
      useSkillState.mockReturnValue({
        ...initialSkillState,
        skillForm: {
          ...mockSkillFormState,
          formMode: "update"
        }
      });
      getSkillFormChanges.mockReturnValue({});
      isSkillFormValid.mockReturnValue(false);
    });
    describe("initial render", () => {
      describe("default tab", () => {
        describe("no skill in selected array", () => {
          test("should render edit warning", async () => {
            const rendered = renderComponent([]);
            expect(rendered.container).toHaveTextContent("A single skill must be selected from the table to edit");
          });
        });
        describe("more than 1 skill in selected array", () => {
          test("should render edit warning", async () => {
            const rendered = renderComponent(["oneSkill", "twoSkill"]);
            expect(rendered.container).toHaveTextContent("A single skill must be selected from the table to edit");
            const onClose = StyledButton.mock.calls[1][0].onClick;
            onClose();
            expect(mockCloseModal).toHaveBeenCalled();
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: "RESET_FORM"
            });
          });
        });
        test("should render GeneralSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(2);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          expect(Tab.mock.calls[0][0].label).toBe("General Skill Settings");
          expect(Tab.mock.calls[1][0].label).toBe("Dynamic Routing");
          expect(Tab.mock.calls[2][0].label).toBe("Legacy Callflow Database");
          expect(rendered.container).toHaveTextContent("Please review all tabs for required * fields");
          expect(StyledButton).toHaveBeenCalledTimes(4);
          expect(StyledButton.mock.calls[3][0].disabled).toBe(true);
        });
      });
      describe("dynamic routing tab is clicked", () => {
        test("should render dynamic routing message", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(2);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[1][0].onClick;
          changeTab();
          expect(rendered.container).toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
        });
      });
      describe("legacy callflow tab is clicked", () => {
        test("should render CallflowSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(2);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[2][0].onClick;
          changeTab();
          expect(CallflowSkillForm).toHaveBeenCalledTimes(1);
        });
      });
      describe("we return to the general tab", () => {
        test("should render CallflowSkillForm", async () => {
          const rendered = renderComponent();
          expect(GeneralSkillForm).toHaveBeenCalledTimes(2);
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          expect(CallflowSkillForm).toHaveBeenCalledTimes(0);
          const changeTab = Tab.mock.calls[1][0].onClick;
          changeTab();
          expect(rendered.container).toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
          const changeBack = Tab.mock.calls[0][0].onClick;
          changeBack();
          expect(rendered.container).not.toHaveTextContent("Dynamic Routing will be migrated over to use this skill in a future sprint");
        });
      });
    });
    describe("submit button is clicked", () => {
      const formChanges = {
        profileIds: [14]
      };
      beforeEach(() => {
        jest.clearAllMocks();
        isSkillFormValid.mockReturnValue(true);
        areVhFieldsValid.mockReturnValue(true);
        getSkillFormChanges.mockReturnValue(formChanges);
        updateSkill.mockResolvedValue({
          status: 200,
          messages: [success]
        });
      });
      describe("all service calls are successful", () => {
        test("form rerenders when saving and succeded", async () => {
          renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          expectOnlyPassedProps(ModalOverlay, {
            message: "Skill Successfully Updated",
            status: "success"
          }, 1);
          jest.runAllTimers();
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.RESET_FORM
          });
          expect(mockSetAction).toHaveBeenCalledWith(null);
        });
      });
      describe("partial error is thrown creating new skill", () => {
        beforeEach(() => {
          createSkill.mockResolvedValue({
            status: 206,
            messages: [error]
          });
          useSkillState.mockReturnValue({
            ...initialSkillState,
            skillForm: {
              ...initialSkillState.skillForm,
              taskQueue: {
                ...initialSkillState.skillForm.taskQueue,
                isNew: true
              }
            }
          });
        });
        test("error messages are displayed", async () => {
          const rendered = renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.RESET_FORM
          });
          jest.runAllTimers();
          expect(rendered.container).toHaveTextContent("The following errors were thrown");
          expect(rendered.container).toHaveTextContent(error);
        });
        describe("close button is clicked", () => {
          test("close modal and skill dispatch are called", async () => {
            const rendered = renderComponent();
            const submit = StyledButton.mock.calls[1][0].onClick;
            submit();
            await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
            expectOnlyPassedProps(ModalOverlay, {
              message: "Processing...",
              status: "saving"
            }, 0);
            expect(mockSkillDispatch).toHaveBeenCalledWith({
              type: skillActions.RESET_FORM
            });
            jest.runAllTimers();
            expect(rendered.container).toHaveTextContent("The following errors were thrown");
            const closeModal = StyledButton.mock.calls[4][0].onClick;
            closeModal();
            expect(mockCloseModal).toHaveBeenCalled();
            expect(mockSkillDispatch).toHaveBeenCalledWith({ type: skillActions.RESET_FORM });
          });
        });
      });
      describe("full error is thrown creating new skill", () => {
        test("error messages are displayed", async () => {
          updateSkill.mockRejectedValue(error);
          renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          expectOnlyPassedProps(ModalOverlay, {
            message: "Failed to Update Skill: Aww",
            status: "fail"
          }, 1);
        });
      });
      describe("refresh state error is thrown", () => {
        test("Success is still rendered", async () => {
          renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          expectOnlyPassedProps(ModalOverlay, {
            message: "Skill Successfully Updated",
            status: "success"
          }, 1);
          jest.runAllTimers();

          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: skillActions.RESET_FORM
          });
          jest.runAllTimers();
          expect(mockSetAction).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe("cancel button is clicked", () => {
    test("close modal and skill dispatch are called", () => {
      renderComponent();
      const closeModal = StyledButton.mock.calls[0][0].onClick;
      closeModal();
      expect(mockCloseModal).toHaveBeenCalled();
      expect(mockSkillDispatch).toHaveBeenCalledWith({ type: skillActions.RESET_FORM });
    });
  });
});