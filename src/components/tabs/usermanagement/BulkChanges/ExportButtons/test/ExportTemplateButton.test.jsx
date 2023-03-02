import ExportTemplateButton from "../ExportTemplateButton";
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

jest.mock("../../BulkChanges.Styles", () => ({
  Button: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.useFakeTimers();
const createTemplates = getCreateTemplates(initialTestState);
const useRefSpy = jest.spyOn(React, "useRef");
const mockSave = jest.fn();

const successfulRows = [
  {
    defaultSkills: "Comma delimited list of skill/level pairings. Skills can be on their own or have a ':level' to represent the level. If left blank, no skills will be added to the user",
    didUser: "Y/N indicator to represent if user has a DirecT Dial Number",
    directDialNumber: "10 digit Direct Dial Phone Number, will be prepended with +1. Only required when DID User is true",
    extension: "Enter a number for the users extension or type Y for a randomly generated extension. Enter N for no extension",
    managerNNumber: "N Number of the Manager",
    nNumber: "Agents N Number",
    outgoingNumber: "If the user is not a DID user this is their Outgoing number",
    profileId: "Profile Id",
    zeroOutEnabled: "Y/N Indicator to represent if the zero out skill aligned to the profile ID should be added to the users current skills. Only required when DID User is true"
  },
  {
    defaultSkills: "bscCommissions:3, blSalesL1:2, aisl1",
    didUser: "Y",
    directDialNumber: "6038518200",
    extension: "65214",
    managerNNumber: "n0088625",
    nNumber: "n0263786",
    outgoingNumber: "6038518288",
    profileId: 3,
    zeroOutEnabled: "Y"
  }
];

const expectedColumns = [
  {
    field: "nNumber",
    textAlign: "center",
    title: "N Number",
    width: undefined,
    wrap: true
  },
  {
    field: "profileId",
    textAlign: "center",
    title: "Profile Id",
    width: undefined,
    wrap: true
  },
  {
    field: "managerNNumber",
    textAlign: "center",
    title: "Manager N Number",
    width: undefined,
    wrap: true
  },
  {
    field: "defaultSkills",
    textAlign: "center",
    title: "Default Skills",
    width: undefined,
    wrap: true
  },
  {
    field: "extension",
    textAlign: "center",
    title: "Extension",
    width: undefined,
    wrap: true
  },
  {
    field: "didUser",
    textAlign: "center",
    title: "Did User",
    width: undefined,
    wrap: true
  },
  {
    field: "directDialNumber",
    textAlign: "center",
    title: "Direct Dial Number",
    width: undefined,
    wrap: true
  },
  {
    field: "zeroOutEnabled",
    textAlign: "center",
    title: "Zero Out Enabled",
    width: undefined,
    wrap: true
  },
  {
    field: "outgoingNumber",
    textAlign: "center",
    title: "Outgoing Number",
    width: undefined,
    wrap: true
  }
];

describe("ExportErrorsButton", () => {
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
      render(<ExportTemplateButton template={createTemplates.CREATE_TRITON_USER.fields}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
    });
    describe("onClick", () => {
      test("handleExport is called", () => {
        render(<ExportTemplateButton template={createTemplates.CREATE_TRITON_USER.fields}/>);
        render(Button.mock.calls[0][0].children);
        const onClick = Button.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith(successfulRows, expectedColumns);
      });
      describe("_export is null", () => {
        beforeEach(() => {
          useRefSpy.mockReturnValue(null);
        });
        test("handleExport is called", () => {
          render(<ExportTemplateButton template={createTemplates.CREATE_TRITON_USER.fields}/>);
          render(Button.mock.calls[0][0].children);
          const onClick = Button.mock.calls[0][0].onClick;
          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});