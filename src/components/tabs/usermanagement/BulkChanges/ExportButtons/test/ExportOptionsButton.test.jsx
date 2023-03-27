import ExportOptionsButton from "../ExportOptionsButton";
import { Button } from "../../BulkChanges.Styles";
import { getCreateTemplates } from "../../BulkTemplates";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { Modal } from "@mui/material";

jest.mock("../../BulkChanges.Styles", () => ({
  Button: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Modal: jest.fn()
}));

jest.useFakeTimers();
const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

const createTemplates = getCreateTemplates(initialTestState);
const expectedRows = [
  {
    defaultSkills: "lscOBDialer1 Available levels: 1,2,3",
    managerNNumber: "n1234567",
    profileId: 1
  },
  {
    defaultSkills: "aisgL1",
    managerNNumber: "n7454853",
    profileId: 2
  },
  {
    defaultSkills: "bscCommisssions Available levels: 1,2,3,4,5,6,7",
    profileId: 3
  },
  {
    defaultSkills: "bscCbsL2"
  },
  {
    defaultSkills: "lscUSAA"
  }
];
const expectedColumns = [
  {
    field: "profileId",
    options: [
      1,
      2,
      3
    ],
    textAlign: "center",
    title: "Profile Id",
    width: undefined,
    wrap: true
  },
  {
    field: "managerNNumber",
    options: [
      "n1234567",
      "n7454853"
    ],
    textAlign: "center",
    title: "Manager N Number",
    width: undefined,
    wrap: true
  },
  {
    field: "defaultSkills",
    options: [
      "lscOBDialer1 Available levels: 1,2,3",
      "aisgL1",
      "bscCommisssions Available levels: 1,2,3,4,5,6,7",
      "bscCbsL2",
      "lscUSAA"
    ],
    textAlign: "center",
    title: "Default Skills",
    width: undefined,
    wrap: true
  }
];

describe("ExportOptionsButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    setupMockedComponents({
      Button
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} state={initialTestState}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
    });
    describe("onClick", () => {
      test("handleExport is called", () => {
        render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} state={initialTestState}/>);
        render(Button.mock.calls[0][0].children[0]);
        const onClick = Button.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith(expectedRows, expectedColumns);
      });
      describe("_export is null", () => {
        beforeEach(() => {
          useRefSpy.mockReturnValue(null);
        });
        test("handleExport is called", () => {
          render(<ExportOptionsButton template={[
            ...createTemplates.CREATE_TRITON_USER.fields,
            {
              field: "empty options",
              options: () => []
            }
          ]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children);
          const onClick = Button.mock.calls[0][0].onClick;
          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});