import ResultsModal from "../ResultsModal";
import {
  ModalHeader,
  PaperContainer,
  StyledButton
} from "components";
import { theme } from "globals";
import React from "react";
import {
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  ModalHeader: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

const successfulWorkersMock = [
  {
    name: "Joe Bob"
  },
  {
    name: "Billy Joe"
  }
];

const failureWorkersMock = [
  {
    name: "Dirty Harry",
    reason: "You Feeling lucky?"
  }
];

const warningWorkersMock = [
  {
    name: "The Duke",
    reason: "Worker default_skills is equal to currently assigned skills"
  }
];

const handleClose = jest.fn();

const renderModal = (successfulWorkers, unsuccessfulWorkers) => {
  return render(<ResultsModal handleClose={handleClose} successfulWorkers={successfulWorkers} unsuccessfulWorkers={unsuccessfulWorkers} />);
};

describe("<ResultsModal />", () => {
  beforeEach(() => {
    setupMockedComponents({
      ModalHeader,
      StyledButton
    });
    handleClose.mockClear();
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });
  describe("modal where there everything went well", () => {
    test("should only display success section, with correct stlyings", () => {
      const rendered = renderModal(successfulWorkersMock, []);
      expect(rendered.queryAllByTestId("successContainer")).toHaveLength(1);
      // expect(rendered.queryAllByTestId("successContainer")).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
      expect(rendered.getByTestId("successContainer")).toHaveStyleRule("border-color", theme.successColor);
      expect(rendered.getByTestId("successContainer")).toHaveStyleRule("background-color", theme.resultsModal.fadedSuccess);
      expect(rendered.getByText("2 worker(s) reset successfully")).toBeTruthy();
      expect(rendered.queryAllByTestId("warningContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("failureContainer")).toHaveLength(0);
    });
  });
  describe("modal where there were only warnings", () => {
    test("should only display warning section, with correct stlyings", () => {
      const rendered = renderModal([], warningWorkersMock);
      expect(rendered.queryAllByTestId("successContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("warningContainer")).toHaveLength(1);
      expect(rendered.container).toHaveTextContent(`${warningWorkersMock[0].name} was not updated: [${warningWorkersMock[0].reason}]`);
      expect(rendered.getByTestId("warningContainer")).toHaveStyleRule("border-color", theme.warningColor);
      expect(rendered.getByTestId("warningContainer")).toHaveStyleRule("background-color", theme.resultsModal.fadedWarning);
      expect(rendered.queryAllByTestId("failureContainer")).toHaveLength(0);
    });
  });
  describe("modal where there were only failures", () => {
    test("should only display failure section, with correct stlyings", () => {
      const rendered = renderModal([], failureWorkersMock);
      expect(rendered.queryAllByTestId("successContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("warningContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("failureContainer")).toHaveLength(1);
      expect(rendered.container).toHaveTextContent(`${failureWorkersMock[0].name} was not updated: [${failureWorkersMock[0].reason}]`);
      expect(rendered.getByTestId("failureContainer")).toHaveStyleRule("border-color", theme.errorColor);
      expect(rendered.getByTestId("failureContainer")).toHaveStyleRule("background-color", theme.resultsModal.fadedError);
    });
  });
  describe("modal where there was every case of result", () => {
    test("should display all sections", () => {
      const rendered = renderModal(successfulWorkersMock, [...failureWorkersMock, ...warningWorkersMock]);
      expect(rendered.queryAllByTestId("successContainer")).toHaveLength(1);
      expect(rendered.queryAllByTestId("warningContainer")).toHaveLength(1);
      expect(rendered.queryAllByTestId("failureContainer")).toHaveLength(1);
    });
  });
  describe("modal where there was an error", () => {
    test("should display error message", () => {
      const error = "Oh noooooo";
      const rendered = render(<ResultsModal error={error} handleClose={handleClose} />);
      expect(rendered.queryAllByTestId("successContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("warningContainer")).toHaveLength(0);
      expect(rendered.queryAllByTestId("failureContainer")).toHaveLength(1);
      expect(rendered.container).toHaveTextContent(error);
      expect(rendered.getByTestId("failureContainer")).toHaveStyleRule("border-color", theme.errorColor);
      expect(rendered.getByTestId("failureContainer")).toHaveStyleRule("background-color", theme.resultsModal.fadedError);
    });
  });
});
