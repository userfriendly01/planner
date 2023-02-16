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
  Paper: jest.requireActual("@mui/material").Paper
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const updateTemplates = getUpdateTemplates();
const uploadedForm = [
  { n_number: "n0263786" },
  { n_number: "n0263700" },
  { n_number: "n0266600" },
  { n_number: "n0212700" }
];
const mockHandleClose = jest.fn();

const renderComponent = () => {
  return render(<ProcessingModal
    selectedTemplates={[updateTemplates.UPDATE_USERS_MANAGER]}
    handleClose={mockHandleClose}
    consolidatedFieldsList={updateTemplates.UPDATE_USERS_MANAGER.fields}
    uploadedForm={uploadedForm}
  />);
};

describe("<BulkUpdateAttributes />", () => {
  beforeEach(() => {
    performValidations.mockResolvedValue("yay!");
    jest.clearAllMocks();
    setupMockedComponents({
      ExportErrorsButton,
      ExportSuccessButton,
      ProgressBar,
      StyledButton
    });
  });
  describe("initial render", () => {
    describe("Perform Validations was successful", () => {
      test("should render expected components", async () => {
        const rendered = renderComponent();
        expect(ProgressBar.mock.calls.length).toBe(1);
        expect(ProgressBar.mock.calls[0][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 4
        });
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("0 Validation Errors have been found for this template.");
          expect(ExportErrorsButton.mock.calls.length).toBe(0);
          expect(StyledButton.mock.calls.length).toBe(2);
          expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
          expect(StyledButton.mock.calls[1][0].children).toStrictEqual(["Process ", 4, " out of ", 4, " rows"]);
        });
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
        const rendered = renderComponent();
        expect(ProgressBar.mock.calls.length).toBe(1);
        expect(ProgressBar.mock.calls[0][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 4
        });
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("1 Validation Errors have been found for this template.");
          expect(ExportErrorsButton.mock.calls.length).toBe(1);
          expect(ExportErrorsButton.mock.calls[0][0].errors).toStrictEqual([errorRow]);
          expect(ExportErrorsButton.mock.calls[0][0].children).toBe("Export Validation Errors");
          expect(StyledButton.mock.calls.length).toBe(2);
          expect(StyledButton.mock.calls[0][0].children).toBe("Cancel");
          expect(StyledButton.mock.calls[1][0].children).toStrictEqual(["Process ", 1, " out of ", 4, " rows"]);
        });
      });
    });
  });
  describe("Cancel Button is clicked", () => {
    test("handleClose should be called", async () => {
      renderComponent();
      await waitFor(() => {
        expect(StyledButton.mock.calls.length).toBe(2);
        const cancel = StyledButton.mock.calls[0][0].onClick;
        act(() => cancel());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe("Process Button is clicked", () => {
    beforeEach(() => {
      initiateCalls.mockResolvedValue(uploadedForm);
    });
    describe("Process was successful", () => {
      test("Should render progress bar and processing results", async () => {
        renderComponent();
        await waitFor(() => expect(StyledButton.mock.calls.length).toBe(2));
        const process = StyledButton.mock.calls[1][0].onClick;
        act(() => process());
        expect(initiateCalls).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(ProgressBar.mock.calls.length).toBe(4));
        expect(ProgressBar.mock.calls[3][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 4
        });
        expect(ExportErrorsButton.mock.calls.length).toBe(0);
        expect(ExportSuccessButton.mock.calls.length).toBe(1);
        expect(ExportSuccessButton.mock.calls[0][0].successfulRows).toStrictEqual(uploadedForm);
      });
    });
    describe("Process Errors were thrown", () => {
      beforeEach(() => {
        initiateCalls.mockRejectedValue({
          errors: [ uploadedForm[1] ],
          success: [ uploadedForm[0], uploadedForm[2], uploadedForm[3] ]
        });
      });
      test("Should render progress bar and processing results", async () => {
        renderComponent();
        await waitFor(() => expect(StyledButton.mock.calls.length).toBe(2));
        const process = StyledButton.mock.calls[1][0].onClick;
        act(() => process());
        expect(initiateCalls).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(ProgressBar.mock.calls.length).toBe(4));
        expect(ProgressBar.mock.calls[3][0]).toStrictEqual({
          completedRows: 0,
          totalRowCount: 4
        });
        expect(ExportErrorsButton.mock.calls.length).toBe(1);
        expect(ExportErrorsButton.mock.calls[0][0].errors).toStrictEqual([ uploadedForm[1] ]);
        expect(ExportSuccessButton.mock.calls.length).toBe(1);
        expect(ExportSuccessButton.mock.calls[0][0].successfulRows).toStrictEqual([ uploadedForm[0], uploadedForm[2], uploadedForm[3] ]);
      });
    });
    describe("Close Button is clicked", () => {
      test("handleClose should be called", async () => {
        renderComponent();
        await waitFor(() => expect(StyledButton.mock.calls.length).toBe(2));
        const process = StyledButton.mock.calls[1][0].onClick;
        act(() => process());
        expect(initiateCalls).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(ProgressBar.mock.calls.length).toBe(4));
        await waitFor(() => expect(StyledButton.mock.calls.length).toBe(3));
        const close = StyledButton.mock.calls[2][0].onClick;
        act(() => close());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
      });
    });
  });

});
