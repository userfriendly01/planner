import BulkChanges from "../BulkChanges";
import {
  BulkCreateForm,
  BulkUpdateForm
} from "../BulkActions";
import { views } from "../BulkChanges.Interfaces";
import {
  ExportTemplateButton,
  ExportOptionsButton
} from "../ExportButtons";
import { ProcessingModal } from "../Processing";
import {
  Dropdown,
  StyledButton
} from "components";
import React from "react";
import {
  act,
  expectOnlyPassedProps,
  fireEvent,
  initialTestState,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import * as XLSX from "xlsx";
import { Modal } from "@mui/material";
import { useAdminState } from "context";

jest.mock("../BulkActions", () => ({
  BulkCreateForm: jest.fn(),
  BulkUpdateForm: jest.fn()
}));

jest.mock("../ExportButtons", () => ({
  ExportTemplateButton: jest.fn(),
  ExportOptionsButton: jest.fn()
}));

jest.mock("../Processing", () => ({
  ProcessingModal: jest.fn()
}));

jest.mock("components", () => ({
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn(),
  Paper: jest.fn()
}));

jest.mock("xlsx",() => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

const mockSelectedTemplate = {
  name: "I'm pretend!",
  fields: [{
    field: "Field!"
  },
  {
    field: "Field 2!"
  }]
};

const mockSelectedWFMTemplate = {
  name: "CREATE_CALABRIO_WFM_PERSON",
  fields: [{
    field: "Field!"
  },
  {
    field: "Field 2!"
  }]
};

describe("<BulkChanges />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown,
      BulkCreateForm,
      BulkUpdateForm,
      ExportTemplateButton,
      ExportOptionsButton,
      Modal,
      ProcessingModal,
      StyledButton
    });
  });
  describe("initial render", () => {
    test.only("should render as expected", () => {
      const rendered = render(<BulkChanges />);
      expect(rendered.container).not.toHaveTextContent("Step 2: Export Template & Template Options");
      expect(rendered.container).not.toHaveTextContent("Step 3: Upload completed Spreadsheet");
      expect(rendered.container).not.toHaveTextContent("Step 4: Process Bulk Create");
      expect(Dropdown.mock.calls.length).toBe(2);
      expect(Dropdown.mock.calls[1][0].label).toBe("Select a change type");
      expect(Dropdown.mock.calls[1][0].value).toBe(views.BULK_CREATE_USERS);
      expect(Dropdown.mock.calls[1][0].options).toStrictEqual(Object.values(views));
      expect(ExportTemplateButton.mock.calls.length).toBe(0);
      expect(ExportOptionsButton.mock.calls.length).toBe(0);
      expect(StyledButton.mock.calls.length).toBe(0);
      expect(ProcessingModal.mock.calls.length).toBe(0);
      expect(BulkCreateForm.mock.calls.length).toBe(2);
    });
  });
  describe("View is views.BULK_CREATE_USERS ", () => {
    describe("selected templates do not include CREATE_CALABRIO_WFM_PERSON", () => {
      test("should update view and clear form", async () => {
        const rendered = render(<BulkChanges />);
        expect(BulkCreateForm.mock.calls.length).toBe(2);
        const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
        act(() => setSelectedTemplates([mockSelectedTemplate]));
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
          expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
          expect(ExportOptionsButton.mock.calls[0][0].disabled).toBe(false);
        });
        const updateView = Dropdown.mock.calls[3][0].updateValue;
        act(() => updateView(null, views.BULK_CREATE_USERS));
        expect(rendered.container).not.toHaveTextContent("Step 2: Export Template & Template Options");
        expect(rendered.container).not.toHaveTextContent("Step 3: Upload completed Spreadsheet");
        expect(Dropdown.mock.calls[4][0].value).toBe(views.BULK_CREATE_USERS);
      });
    });
    describe("selected templates include CREATE_CALABRIO_WFM_PERSON", () => {
      describe("wfm options and people are already loaded", () => {
        test("should update view and clear form", async () => {
          const rendered = render(<BulkChanges />);
          expect(BulkCreateForm.mock.calls.length).toBe(2);
          const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
          act(() => setSelectedTemplates([mockSelectedWFMTemplate]));
          await waitFor(() => {
            expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
            expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
          });
          const updateView = Dropdown.mock.calls[3][0].updateValue;
          act(() => updateView(null, views.BULK_CREATE_USERS));
          expect(rendered.container).not.toHaveTextContent("Step 2: Export Template & Template Options");
          expect(rendered.container).not.toHaveTextContent("Step 3: Upload completed Spreadsheet");
          expect(Dropdown.mock.calls[4][0].value).toBe(views.BULK_CREATE_USERS);
        });
      });
    });
  });
  describe("View is updated to views.BULK_UPDATE ", () => {
    test("should update view and clear form", async () => {
      const rendered = render(<BulkChanges />);
      expect(BulkCreateForm.mock.calls.length).toBe(2);
      const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
      act(() => setSelectedTemplates([mockSelectedTemplate]));
      await waitFor(() => {
        expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
        expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
      });
      const updateView = Dropdown.mock.calls[3][0].updateValue;
      act(() => updateView(null, views.BULK_UPDATE));
      expect(BulkUpdateForm.mock.calls.length).toBe(2);
      expect(rendered.container).not.toHaveTextContent("Step 2: Export Template & Template Options");
      expect(rendered.container).not.toHaveTextContent("Step 3: Upload completed Spreadsheet");
      expect(Dropdown.mock.calls[4][0].value).toBe(views.BULK_UPDATE);
    });
  });
  describe("View is updated to views.BULK_ADD_MANAGER ", () => {
    test("should render with steps 1, 2 & 3 ", async () => {
      const rendered = render(<BulkChanges />);
      expect(BulkCreateForm.mock.calls.length).toBe(2);
      const updateView = Dropdown.mock.calls[1][0].updateValue;
      act(() => updateView(null, views.BULK_ADD_MANAGER));
      expect(rendered.container).toHaveTextContent("Step 1: Mentally Prepare");
      expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
      expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
      expect(Dropdown.mock.calls[2][0].value).toBe(views.BULK_ADD_MANAGER);
    });
  });
  describe("selected Templates Length > 0", () => {
    test("Component is re-rendered with Step 2 and step 3", () => {
      const rendered = render(<BulkChanges />);
      expect(BulkCreateForm.mock.calls.length).toBe(2);
      const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
      act(() => setSelectedTemplates([mockSelectedTemplate]));
      expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
      expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
      expect(ExportTemplateButton.mock.calls.length).toBe(2);
      expect(ExportOptionsButton.mock.calls.length).toBe(2);
      expect(rendered.container).not.toHaveTextContent("Step 4: Process Bulk Create");
      expect(ExportOptionsButton.mock.calls[0][0].disabled).toBe(false);
    });
  });
  describe("Form is uploaded", () => {
    const readAsArrayBufferMock = jest.fn();
    const mockFile = new File(["yo"], "yo.xlsx");
    const sheetData = [{
      boo: "hi",
      "__rowNum__": 1
    }];
    const event = {
      target: {
        files: [mockFile],
        result: {
          SheetNames: ["stuff"],
          Sheets: {
            stuff: sheetData
          }
        }
      },
      preventDefault: jest.fn()
    };
    beforeEach(() => {
      XLSX.read.mockReturnValue({
        SheetNames: ["thing1"],
        Sheets: {
          thing1: { boo: "hi" }
        }
      });
      XLSX.utils.sheet_to_json.mockReturnValue(sheetData);
      jest.spyOn(window, "FileReader").mockImplementation(function () {
        const self = this;
        this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
          self.onload(event);
        });
      });
    });
    test("Component is re-rendered with Step 4", async () => {
      const rendered = render(<BulkChanges />);
      expect(BulkCreateForm.mock.calls.length).toBe(2);
      const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
      act(() => setSelectedTemplates([mockSelectedTemplate]));
      const uploadForm = rendered.getByTestId("file-upload");
      act(() => StyledButton.mock.calls[1][0].onClick()); //will do nothing in test
      act(() => fireEvent.change(uploadForm, event));
      await waitFor(() => {
        expect(rendered.container).toHaveTextContent("yo.xlsx has been uploaded");
      });
      expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
      expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
      expect(rendered.container).toHaveTextContent("Step 4: Process Bulk Create");
      expect(StyledButton.mock.calls.length).toBe(4);
    });
    describe("e.target.files is not an array of files", () => {
      const event = {
        target: {
          files: "somthing else",
          result: {
            SheetNames: ["stuff"],
            Sheets: {
              stuff: sheetData
            }
          }
        },
        preventDefault: jest.fn()
      };
      jest.spyOn(window, "FileReader").mockImplementation(function () {
        const self = this;
        this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
          self.onload(event);
        });
      });
      test("should not setFilenameText", async () => {
        const rendered = render(<BulkChanges />);
        expect(BulkCreateForm.mock.calls.length).toBe(2);
        const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
        act(() => setSelectedTemplates([mockSelectedTemplate]));
        const uploadForm = rendered.getByTestId("file-upload");
        act(() => fireEvent.change(uploadForm, event));
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("Step 4: Process Bulk Create");
        });
        expect(rendered.container).not.toHaveTextContent("yo.xlsx has been uploaded");
      });
    });
    describe("e.target.files is null", () => {
      const event = {
        target: {
          files: null,
          result: {
            SheetNames: ["stuff"],
            Sheets: {
              stuff: sheetData
            }
          }
        },
        preventDefault: jest.fn()
      };
      jest.spyOn(window, "FileReader").mockImplementation(function () {
        const self = this;
        this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
          self.onload(event);
        });
      });
      test("should not setFilenameText or call setUploadForm", async () => {
        const rendered = render(<BulkChanges />);
        expect(BulkCreateForm.mock.calls.length).toBe(2);
        const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
        act(() => setSelectedTemplates([mockSelectedTemplate]));
        const uploadForm = rendered.getByTestId("file-upload");
        act(() => fireEvent.change(uploadForm, event));
        expect(rendered.container).not.toHaveTextContent("Step 4: Process Bulk Create");
        expect(rendered.container).not.toHaveTextContent("yo.xlsx has been uploaded");
      });
    });
    describe("Process Button is clicked", () => {
      test("should render processing modal", async () => {
        const rendered = render(<BulkChanges />);
        expect(BulkCreateForm.mock.calls.length).toBe(2);
        const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
        act(() => setSelectedTemplates([mockSelectedTemplate]));
        const uploadForm = rendered.getByTestId("file-upload");
        act(() => fireEvent.change(uploadForm, event));
        await waitFor(() => {
          expect(rendered.container).toHaveTextContent("yo.xlsx has been uploaded");
        });
        expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
        expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
        expect(rendered.container).toHaveTextContent("Step 4: Process Bulk Create");
        const process = StyledButton.mock.calls[3][0].onClick;
        act(() => process());
        expect(Modal.mock.calls[10][0].open).toBe(true);
        render(Modal.mock.calls[10][0].children);
        act(() => Modal.mock.calls[10][0].onClose()); //should do nothing
        expect(ProcessingModal.mock.calls.length).toBe(1);
        expectOnlyPassedProps(ProcessingModal, {
          selectedTemplates: [mockSelectedTemplate],
          uploadedForm: [{
            ...sheetData[0],
            rowNumber: 2
          }],
          consolidatedFieldsList: mockSelectedTemplate.fields
        });
      });
      describe("handleClose is called", () => {
        test("resetBulkChanges is called", async () => {
          const rendered = render(<BulkChanges />);
          expect(BulkCreateForm.mock.calls.length).toBe(2);
          const setSelectedTemplates = BulkCreateForm.mock.calls[1][0].setSelectedTemplates;
          act(() => setSelectedTemplates([mockSelectedTemplate]));
          const uploadForm = rendered.getByTestId("file-upload");
          act(() => fireEvent.change(uploadForm, event));
          await waitFor(() => {
            expect(rendered.container).toHaveTextContent("Step 2: Export Template & Template Options");
            expect(rendered.container).toHaveTextContent("Step 3: Upload completed Spreadsheet");
            expect(rendered.container).toHaveTextContent("Step 4: Process Bulk Create");
            expect(rendered.container).toHaveTextContent("yo.xlsx has been uploaded");
          });
          const process = StyledButton.mock.calls[3][0].onClick;
          act(() => process());
          render(Modal.mock.calls[10][0].children);
          const handleClose = ProcessingModal.mock.calls[0][0].handleClose;
          act(() => handleClose());
          await waitFor(() => {
            expect(rendered.container).not.toHaveTextContent("Step 2: Export Template & Template Options");
            expect(rendered.container).not.toHaveTextContent("Step 3: Upload completed Spreadsheet");
            expect(rendered.container).not.toHaveTextContent("Step 4: Process Bulk Create");
            expect(rendered.container).not.toHaveTextContent("yo.xlsx has been uploaded");
          });
        });
      });
    });
  });
});