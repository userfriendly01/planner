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
import BusinessUnitModal from "../../BusinessUnitModal";
import { Modal } from "@mui/material";

jest.mock("../../BulkChanges.Styles", () => ({
  Button: jest.fn()
}));

jest.mock("@progress/kendo-react-excel-export", () => ({
  ExcelExport: jest.fn()
}));

jest.mock("../../BusinessUnitModal", () => jest.fn());

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
    profileId: 1,
    // routing_team: "Profile 2: licencedCSC",
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
    defaultSkills: "bscCbsL2",
    profileId: 396
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
      3,
      396
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
  // {
  //   field: "routing_team",
  //   options: [
  //     "Profile 2: licencedCSC"
  //   ],
  //   textAlign: "center",
  //   title: "Routing Team",
  //   width: undefined,
  //   wrap: true
  // } //Not ready to go yet
];

const expectedWFMRows = [
  {
    wfmBusinessUnit: "WFM Business Unit1",
    wfmRole: "Role1",
    timeZone: "America/New_York (EST/EDT)",
    wfmFirstDayOfWeek: 0,
    wfmWorkflowControlSet: "WFCSet1",
    wfmTeam: "Team1",
    wfmContract: "Contract1",
    wfmContractSchedule: "ContractSchedule1",
    wfmPartTimePercentage: "ParttimePercent1",
    wfmShiftBag: "ShiftBag1",
    wfmBudgetGroup: "BudgetGroup1",
    wfmSkills: "Skill1",
    wfmRotation: "Rotation1",
    wfmAvailability: "Availability1",
    wfmOptionalCols: "OptionalCol1"
  },
  {
    wfmRole: "Role2",
    timeZone: "America/Los_Angeles (PST/PDT)",
    wfmBusinessUnit: "Other WFM Business Unit",
    wfmFirstDayOfWeek: 1,
    wfmTeam: "Team2",
    wfmSkills: "Skill2",
    wfmOptionalCols: "OptionalCol2"
  },
  {
    timeZone: "America/Denver (MST/MDT)",
    wfmFirstDayOfWeek: 2,
    wfmTeam: "Team3 No ID"
  },
  {
    timeZone: "America/Chicago (CST/CDT)",
    wfmFirstDayOfWeek: 3
  },
  {
    timeZone: "America/Phoenix (MST)",
    wfmFirstDayOfWeek: 4
  },
  {
    timeZone: "Pacific/Honolulu (HST)",
    wfmFirstDayOfWeek: 5
  },
  {
    timeZone: "America/Anchorage (AKST/AKDT)",
    wfmFirstDayOfWeek: 6
  }
];
const expectedWFMCols = [
  {
    field: "wfmBusinessUnit",
    title: "WFM Business Unit",
    width: undefined,
    options: [ "WFM Business Unit1", "Other WFM Business Unit" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmRole",
    title: "WFM Role",
    width: undefined,
    options: [ "Role1", "Role2" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "timeZone",
    title: "Time Zone",
    width: undefined,
    options: [
      "America/New_York (EST/EDT)",
      "America/Los_Angeles (PST/PDT)",
      "America/Denver (MST/MDT)",
      "America/Chicago (CST/CDT)",
      "America/Phoenix (MST)",
      "Pacific/Honolulu (HST)",
      "America/Anchorage (AKST/AKDT)"
    ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmFirstDayOfWeek",
    title: "First Day of Week",
    width: undefined,
    options: [0, 1, 2, 3, 4, 5, 6],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmWorkflowControlSet",
    title: "Workflow Control Set",
    width: undefined,
    options: [ "WFCSet1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmTeam",
    title: "WFM Team",
    width: undefined,
    options: [ "Team1", "Team2", "Team3 No ID" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmContract",
    title: "WFM Contract",
    width: undefined,
    options: [ "Contract1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmContractSchedule",
    title: "WFM Contract Schedule",
    width: undefined,
    options: [ "ContractSchedule1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmPartTimePercentage",
    title: "WFM Part Time Percentage",
    width: undefined,
    options: [ "ParttimePercent1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmShiftBag",
    title: "WFM Shift Bag",
    width: undefined,
    options: [ "ShiftBag1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmBudgetGroup",
    title: "WFM Budget Group",
    width: undefined,
    options: [ "BudgetGroup1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmSkills",
    title: "WFM Skills",
    width: undefined,
    options: [ "Skill1", "Skill2" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmRotation",
    title: "WFM Rotation",
    width: undefined,
    options: [ "Rotation1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmAvailability",
    title: "WFM Availability",
    width: undefined,
    options: [ "Availability1" ],
    wrap: true,
    textAlign: "center"
  },
  {
    field: "wfmOptionalCols",
    title: "WFM Optional Columns",
    width: undefined,
    options: [ "OptionalCol1", "OptionalCol2" ],
    wrap: true,
    textAlign: "center"
  }
];


describe("ExportOptionsButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    useRefSpy.mockReturnValue({ current: { save: mockSave }});
    setupMockedComponents({
      Button,
      Modal,
      BusinessUnitModal
    });
  });
  describe("initial render", () => {
    test.only("component renders as expected", () => {
      render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} selectedTemplates={[]} state={initialTestState}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
    });
    describe("onClick", () => {
      test("handleExport is called", () => {
        render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} selectedTemplates={[]} state={initialTestState}/>);
        render(Button.mock.calls[0][0].children[0]);
        const onClick = Button.mock.calls[0][0].onClick;
        act(() => onClick());
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(mockSave).toHaveBeenCalledWith(expectedRows, expectedColumns);
        expect(BusinessUnitModal.mock.calls.length).toBe(0);
      });
      describe("WFM is a selected template", () => {
        test("business unit modal opens, cancel is clicked, modal closes", () => {
          render(<ExportOptionsButton template={createTemplates.CREATE_CALABRIO_WFM_PERSON.fields} selectedTemplates={[{ name: "CREATE_CALABRIO_WFM_PERSON" }]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children[0]);
          const onClick = Button.mock.calls[0][0].onClick;

          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
          expect(Modal.mock.calls[0][0].open).toBe(false);
          expect(Modal.mock.calls[1][0].open).toBe(true);
          render(Modal.mock.calls[1][0].children);
          expect(BusinessUnitModal.mock.calls.length).toBe(1);
          const handleClose = BusinessUnitModal.mock.calls[0][0].handleClose;
          act(() => handleClose());
          expect(Modal.mock.calls[2][0].open).toBe(false);
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
        test("modal is open, option is Business unit option selected", async () => {
          render(<ExportOptionsButton template={createTemplates.CREATE_CALABRIO_WFM_PERSON.fields} selectedTemplates={[{ name: "CREATE_CALABRIO_WFM_PERSON" }]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children[0]);
          const onClick = Button.mock.calls[0][0].onClick;

          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
          expect(Modal.mock.calls[0][0].open).toBe(false);
          expect(Modal.mock.calls[1][0].open).toBe(true);
          render(Modal.mock.calls[1][0].children);
          expect(BusinessUnitModal.mock.calls.length).toBe(1);

          const modalHandleExport = BusinessUnitModal.mock.calls[0][0].handleExport;
          act(() => modalHandleExport("123-321"));

          expect(mockSave).toHaveBeenCalledTimes(1);
          expect(mockSave).toHaveBeenCalledWith(expectedWFMRows, expectedWFMCols);

        });
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
          ]} selectedTemplates={[]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children);
          const onClick = Button.mock.calls[0][0].onClick;
          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});