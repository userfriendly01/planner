import ExportOptionsButton from "../ExportOptionsButton";
import { Button } from "../../BulkChanges.Styles";
import { getCreateTemplates } from "../../BulkTemplates";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents,
  expectOnlyPassedProps
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
      Button,
      Modal,
      BusinessUnitModal
    });
  });
  describe("initial render", () => {
    test("component renders as expected", () => {
      render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} selectedTemplates={[]} state={initialTestState}/>);
      render(Button.mock.calls[0][0].children[0]);
      expect(Button.mock.calls.length).toBe(1);
      expect(ExcelExport.mock.calls.length).toBe(2);
      expect(BusinessUnitModal.mock.calls.length).toBe(0);
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
          render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} selectedTemplates={[{ name: "CREATE_CALABRIO_WFM_PERSON" }]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children[0]);
          const onClick = Button.mock.calls[0][0].onClick;

          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
          expect(Modal.mock.calls[0][0].open).toBe(false);
          expect(Modal.mock.calls[1][0].open).toBe(true);
          render(Modal.mock.calls[1][0].children);
          expect(BusinessUnitModal.mock.calls.length).toBe(1);
          expectOnlyPassedProps(BusinessUnitModal, {
            wfmBusinessUnit: null
          });
          const handleClose = BusinessUnitModal.mock.calls[0][0].handleClose;
          act(() => handleClose());
          expect(Modal.mock.calls[2][0].open).toBe(false);
          expect(mockSave).toHaveBeenCalledTimes(0);
        });
        test("modal opens, option is Business unit option selected", async () => {
          render(<ExportOptionsButton template={createTemplates.CREATE_TRITON_USER.fields} selectedTemplates={[{ name: "CREATE_CALABRIO_WFM_PERSON" }]} state={initialTestState}/>);
          render(Button.mock.calls[0][0].children[0]);
          const onClick = Button.mock.calls[0][0].onClick;

          act(() => onClick());
          expect(mockSave).toHaveBeenCalledTimes(0);
          expect(Modal.mock.calls[0][0].open).toBe(false);
          expect(Modal.mock.calls[1][0].open).toBe(true);
          render(Modal.mock.calls[1][0].children);
          expect(BusinessUnitModal.mock.calls.length).toBe(1);
          // TODO: This isn't working... can I not test this here?
          // const handleUpdate = BusinessUnitModal.mock.calls[0][0].handleUpdate;
          // console.log(handleUpdate);
          // act(() => handleUpdate("GRS Finance"));
          // await waitFor(() => {
            // expect(BusinessUnitModal.mock.calls.length).toBe(2)
            // expect(BusinessUnitModal.mock.calls[0][0].wfmBusinessUnit).toBe(2)
          // });

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