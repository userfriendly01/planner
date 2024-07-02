import React from "react";
import { DeleteForm }from "../DeleteForm";
import {
  expectOnlyPassedProps,
  initialSkillState,
  initialTestState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { ModalOverlay } from "components/ModalOverlay";
import { StyledButton } from "components/StyledButton";
import {
  useAdminState,
  useAdminDispatch,
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { loadConsolidatedSkills } from "services/skill";
import { updateUser } from "services/user";
import { getTaskQueues } from "services/taskQueues";
import { identifyImpactedWorkers } from "utils/skillsUtils";
import { handleConcurrentCalls } from "usermanagement/processingUtils";

jest.mock("@mui/material", () => ({
  Divider: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper,
  Tabs: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn(),
  useSkillState: jest.fn(),
  useSkillDispatch: jest.fn()
}));

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("services/skill", () => ({
  createSkill: jest.fn(),
  loadConsolidatedSkills: jest.fn()
}));

jest.mock("services/user", () => ({
  updateUser: jest.fn()
}));

jest.mock("services/taskQueues", () => ({
  getTaskQueues: jest.fn()
}));

jest.mock("utils/skillsUtils", () => ({
  getTargetExpression: jest.requireActual("utils/skillsUtils").getTargetExpression,
  identifyImpactedWorkers: jest.fn()
}));

jest.mock("usermanagement/processingUtils", () => ({
  handleConcurrentCalls: jest.fn()
}));

const error = "Aww";
const success = "Yay!";
const resolvedPromise = {
  status: "fulfilled",
  value: success
};
const rejectedPromise = {
  status: "rejected",
  reason: error
};

const mockTableState = {
  selected: [
    { name: "bscCbsL2" }
  ]
};
const mockCloseModal = jest.fn();
const mockSetAction = jest.fn();
const mockAdminlDispatch = jest.fn();
const mockSkillDispatch = jest.fn();
const mockSetTable = jest.fn();

jest.useFakeTimers();

const renderComponent = () => {
  return render(<DeleteForm
    tableState={mockTableState}
    closeModal={mockCloseModal}
    setAction={mockSetAction}
    setTableState={mockSetTable}
  />);
};

describe("<DeleteForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    useAdminDispatch.mockReturnValue(mockAdminlDispatch);
    useSkillState.mockReturnValue(initialSkillState);
    useSkillDispatch.mockReturnValue(mockSkillDispatch);
    loadConsolidatedSkills.mockResolvedValue(success);
    getTaskQueues.mockResolvedValue(initialSkillState.taskQueues);
    handleConcurrentCalls.mockResolvedValue(resolvedPromise);
    identifyImpactedWorkers.mockReturnValue([
      {
        sid: "firstworker",
        attributes: "atties"
      },
      {
        sid: "secondsworker",
        attributes: "attys"
      }
    ]);
    updateUser.mockResolvedValue(success);
    setupMockedComponents({
      ModalOverlay,
      StyledButton
    });
  });
  describe("initial render", () => {
    test("should render selected skills", async () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("Please carefully review the below skills before confirming the deletion");
      expect(rendered.container).toHaveTextContent("These skills will also be removed from 2 workers that have this skill in either their default skills, routing skills & disabled skills");
      expect(rendered.container).toHaveTextContent("bscCbsL2");
      expect(rendered.container).toHaveTextContent("routing.skills HAS \"bscCbsL2\"");
      expect(rendered.container).toHaveTextContent("BSC - CBS L2");
      expect(StyledButton).toHaveBeenCalledTimes(2);
    });
    describe("selected skills are empty", () => {
      test("should render select skills message", async () => {
        const rendered = render(<DeleteForm
          tableState={{
            selected: []
          }}
          closeModal={mockCloseModal}
          setAction={mockSetAction}
          setTableState={mockSetTable}
        />);
        expect(rendered.container).toHaveTextContent("You must select skills from the skill table to perform skill deletions");
        expect(StyledButton).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("cancel button is clicked", () => {
    test("close modal and skill dispatch are called", () => {
      renderComponent();
      const closeModal = StyledButton.mock.calls[0][0].onClick;
      closeModal();
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
  describe("submit button is clicked", () => {
    describe("all service calls are successful", () => {
      beforeEach(() => {
        handleConcurrentCalls.mockResolvedValue([resolvedPromise]);
        loadConsolidatedSkills.mockResolvedValue(success);
        getTaskQueues.mockResolvedValue(initialSkillState.taskQueues);
      });
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
          message: "Skills Successfully Deleted",
          status: "success"
        }, 1);
        await waitFor(() => expect(loadConsolidatedSkills).toHaveBeenCalled());
        jest.runAllTimers();
        expect(mockSetAction).toHaveBeenCalledWith(null);
        expect(getTaskQueues).not.toHaveBeenCalledTimes(1);
      });
    });
    describe("partial error is thrown creating new skill", () => {
      beforeEach(() => {
        handleConcurrentCalls.mockResolvedValue([resolvedPromise, rejectedPromise, resolvedPromise]);
      });
      describe("delete task queues is not selected ", () => {
        test("error messages are displayed", async () => {
          const rendered = renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          await waitFor(() => expect(loadConsolidatedSkills).toHaveBeenCalled());
          jest.runAllTimers();
          expect(rendered.container).toHaveTextContent("The following errors were thrown");
          expect(rendered.container).toHaveTextContent(error);
          expect(getTaskQueues).not.toHaveBeenCalledTimes(1);
          expect(mockSkillDispatch).not.toHaveBeenCalledWith();
        });
        xtest("error messages are displayed", async () => {
          //test for if we use the task queue functionality
          const rendered = renderComponent();
          const submit = StyledButton.mock.calls[1][0].onClick;
          submit();
          await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(1));
          expectOnlyPassedProps(ModalOverlay, {
            message: "Processing...",
            status: "saving"
          }, 0);
          await waitFor(() => expect(loadConsolidatedSkills).toHaveBeenCalled());
          jest.runAllTimers();
          expect(rendered.container).toHaveTextContent("The following errors were thrown");
          expect(rendered.container).toHaveTextContent(error);
          expect(getTaskQueues).toHaveBeenCalledTimes(1);
          expect(mockSkillDispatch).toHaveBeenCalledWith({
            type: "LOAD_SKILL_OPTIONS",
            payload: {
              applications: initialSkillState.applications,
              timeOfDays: initialSkillState.timeOfDays,
              taskQueues: initialSkillState.taskQueueResults,
              operatingUnits: initialSkillState.operatingUnits
            }
          });
        });
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
          await waitFor(() => expect(loadConsolidatedSkills).toHaveBeenCalled());
          jest.runAllTimers();
          expect(rendered.container).toHaveTextContent("The following errors were thrown");
          const closeModal = StyledButton.mock.calls[4][0].onClick;
          closeModal();
          expect(mockCloseModal).toHaveBeenCalled();
        });
      });
    });
    describe("full error is thrown deleting new skill", () => {
      test("error messages are displayed", async () => {
        handleConcurrentCalls.mockRejectedValue(error);
        renderComponent();
        const submit = StyledButton.mock.calls[1][0].onClick;
        submit();
        await waitFor(() => expect(ModalOverlay).toHaveBeenCalledTimes(2));
        expectOnlyPassedProps(ModalOverlay, {
          message: "Processing...",
          status: "saving"
        }, 0);
        expectOnlyPassedProps(ModalOverlay, {
          message: "Failed to Delete Skills: Aww",
          status: "fail"
        }, 1);
        expect(loadConsolidatedSkills).not.toHaveBeenCalled();
        expect(getTaskQueues).not.toHaveBeenCalledTimes(1);
      });
    });
    describe("refresh state error is thrown", () => {
      beforeEach(() => {
        handleConcurrentCalls.mockResolvedValue([resolvedPromise]);
        loadConsolidatedSkills.mockRejectedValue(error);
        getTaskQueues.mockResolvedValue(initialSkillState.taskQueues);
      });
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
          message: "Skills Successfully Deleted",
          status: "success"
        }, 1);
        await waitFor(() => expect(loadConsolidatedSkills).toHaveBeenCalled());
        jest.runAllTimers();
        expect(mockSetAction).toHaveBeenCalledWith(null);
      });
    });
  });
});