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

jest.mock("../ProgressBar", () => ({
  __esModule: true,
  default: jest.fn()
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

const renderComponent = customUploadedForm => {
  return render(<ProcessingModal
    selectedTemplates={[updateTemplates.UPDATE_USERS_MANAGER]}
    handleClose={mockHandleClose}
    consolidatedFieldsList={updateTemplates.UPDATE_USERS_MANAGER.fields}
    uploadedForm={customUploadedForm || uploadedForm}
  />);
};

describe("<BulkUpdateAttributes />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ExportErrorsButton,
      ExportSuccessButton,
      ExcelExport,
      ProgressBar,
      StyledButton
    });
  });
  describe("initial render", () => {
    test("should render expected components", () => {
      renderComponent();
    });
  });
});
