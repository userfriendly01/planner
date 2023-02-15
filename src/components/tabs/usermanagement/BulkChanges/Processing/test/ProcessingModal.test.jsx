import ProgressBar from "../ProgressBar";
import ProcessingModal from "../ProcessingModal";
import {
  ExportErrorsButton,
  ExportSuccessButton
} from "../../ExportButtons";
import {
  performValidations,
  initiateCalls,
  identifySuccessfulRecords
} from "../../BulkUtils";
import { getUpdateTemplates } from "../../BulkTemplates";
import { StyledButton } from "components";
import { useAdminState } from "context";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  fireEvent,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Paper } from "@mui/material";

jest.mock("../ProgressBar", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../BulkUtils", () => ({
  performValidations: jest.fn(),
  initiateCalls: jest.fn(),
  identifySuccessfulRecords: jest.fn()
}));

jest.mock("../../ExportButtons", () => ({
  ExportErrorsButton: jest.fn(),
  ExportSuccessButton: jest.fn()
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Paper: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

const updateTemplates = getUpdateTemplates();
const uploadedForm = [
  {
    n_number: "n0263786"
  },
  {
    n_number: "n0263700"
  }
];
const mockHandleClose = jest.fn();

const renderComponent = () => {
  render(<ProcessingModal
    selectedTemplates={[updateTemplates.UPDATE_USERS_MANAGER]}
    handleClose={mockHandleClose}
    consolidatedFieldsList={updateTemplates.UPDATE_USERS_MANAGER.fields}
    uploadedForm={uploadedForm}
  />);
  render(Paper.mock.calls[0][0].children);
};

describe("<BulkUpdateAttributes />", () => {
  beforeEach(() => {
    performValidations.mockResolvedValue("yay!");
    jest.clearAllMocks();
    setupMockedComponents({
      ExportErrorsButton,
      ExportSuccessButton,
      ExcelExport,
      Paper,
      ProgressBar,
      StyledButton
    });
  });
  describe("initial render", () => {
    describe("Perform Validations was successful", () => {
      test.only("should render expected components", async () => {
        renderComponent();
        expect(ProgressBar.mock.calls.length).toBe(1);
        expect(ProgressBar.mock.calls[0][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 2
        });
        await waitFor(() => expect(Paper.mock.calls.length).toBe(3));
        const validationResultsWrapper = render(Paper.mock.calls[2][0].children);
        expect(validationResultsWrapper.container).toHaveTextContent("0 Validation Errors have been found for this template.");
        expect(ExportErrorsButton.mock.calls.length).toBe(0);
        expect(StyledButton.mock.calls.length).toBe(2);
        expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
        expect(StyledButton.mock.calls[1][0].children).toStrictEqual(["Process ", 2, " out of ", 2, " rows"]);
      });
    });
    describe("Perform Validations threw an error", () => {
      const errorRow = {
        row: 2,
        error: "boooo"
      };
      const successRow = {
        row: 1,
        result: "yay!"
      };
      beforeEach(() => {
        identifySuccessfulRecords.mockReturnValue([ successRow ]);
        performValidations.mockRejectedValue([ errorRow ]);
      });
      test("should render expected components", async () => {
        renderComponent();
        expect(ProgressBar.mock.calls.length).toBe(1);
        expect(ProgressBar.mock.calls[0][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 2
        });
        await waitFor(() => expect(Paper.mock.calls.length).toBe(3));
        const validationResultsWrapper = render(Paper.mock.calls[2][0].children);
        expect(validationResultsWrapper.container).toHaveTextContent("1 Validation Errors have been found for this template.");
        expect(ExportErrorsButton.mock.calls.length).toBe(1);
        expect(ExportErrorsButton.mock.calls[0][0].errors).toStrictEqual([errorRow]);
        expect(ExportErrorsButton.mock.calls[0][0].children).toBe("Export Validation Errors");
        expect(StyledButton.mock.calls.length).toBe(2);
        expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
        expect(StyledButton.mock.calls[1][0].children).toStrictEqual(["Process ", 1, " out of ", 2, " rows"]);
      });
      describe("error is not an object", () => {
        beforeEach(() => {
          performValidations.mockRejectedValue("boo");
        });
        test("validationErrors should be empty array", () => {
          renderComponent();
        });
      });
    });

  });
  describe("Cancel Button is clicked", () => {
    test("handleClose should be called", () => {
      renderComponent();
    });
  });
  describe("Process Button is clicked", () => {
    describe("Process was successful", () => {
      test("Should ", () => {
        renderComponent();
      });
    });
    describe("Process Errors were thrown", () => {
      test("", () => {
        renderComponent();
      });
    });
  });
  describe("Close Button is clicked", () => {
    test("handleClose should be called", () => {
      renderComponent();
    });
  });
});
