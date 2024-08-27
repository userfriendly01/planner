import {
  Box, Chip, Tooltip
} from "@mui/material";
import {
  GridColDef, GridValueGetterParams
} from "@mui/x-data-grid";
import ModalOnHover from "components/ModalOnHover";
import { CALL_FLOW_NAME } from "components/tabs/dynamicCallFlow/action/Form/ActionFields";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { deepCopyObject } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import React from "react";
import { render } from "testUtils";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  OFFICE_NUMBERS,
  PHONE_NUMBER,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  WHISPER
} from "../../Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER, AFFINITY_VDN, CALL_DETAILS_1, CALL_DETAILS_2, USER_DESTINATION
} from "../../Form/Legacy.PhoneNumber.Form.Fields";
import {
  PhoneNumber, PhoneNumberRecordType
} from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "../../GraphQL/Legacy.PhoneNumber.Interfaces";
import PhoneNumberDataGridColumnDef from "../PhoneNumber.DataGrid.ColumnDef";
import {
  mockDynamicPhoneNumber, mockLegacyPhoneNumber
} from "./PhoneNumber.MockData";

jest.mock("@mui/material", () => {
  const originalFunctionality = jest.requireActual("@mui/material");
  return {
    ...originalFunctionality,
    Box: jest.fn(),
    Chip: jest.fn(),
    Switch: jest.fn(),
    Tooltip: jest.fn()
  };
});
jest.mock(("components/core/SharedComponents/ModalOnHover"), () => jest.fn());

/**
 * Finds column definition by column field name.
 * @param { String } column name of the column field to find.
 * @returns { GridColDef } column definition.
 */
const findPhoneNumberDataGridColumn = (column: string): GridColDef => {
  return PhoneNumberDataGridColumnDef.find(columnDef => columnDef.field === column);
};

/**
 * Builds grid value getter and setter parameters.
 * @param { PhoneNumberRecordType } row to build grid value getter and setter parameters.
 * @returns { GridValueGetterParams<PhoneNumberRecordType, FieldDataType> } grid value getter and setter parameters.
 */
const buildGridValueParams = (row: PhoneNumberRecordType): GridValueGetterParams<PhoneNumberRecordType, FieldDataType> => {
  return {
    row,
    api: undefined,
    value: undefined,
    field: "",
    id: "",
    rowNode: undefined,
    colDef: undefined,
    cellMode: "view",
    hasFocus: false,
    tabIndex: 0
  };
};

/**
 * Expects Tooltip to be called with common props.
 * @param { React.ReactNode } reactNode to render.
 * @param { String } title to render in the Tooltip.
 */
const expectBasicTooltipRender = (reactNode: React.ReactNode, title: string) => {
  render(reactNode as JSX.Element);
  expect(Tooltip as jest.Mock).toHaveBeenCalledWith({
    children: <div className="table-cell-truncate">{title}</div>,
    title
  }, {});
};

describe("PhoneNumber.DataGrid.ColumnDef", () => {
  let mockDynamicPhoneNumberDeepCopy: PhoneNumber;
  let mockLegacyPhoneNumberDeepCopy: CctSharedCallFlowDb;

  beforeEach(() => {
    mockDynamicPhoneNumberDeepCopy = deepCopyObject(mockDynamicPhoneNumber);
    mockLegacyPhoneNumberDeepCopy = deepCopyObject(mockLegacyPhoneNumber);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(PHONE_NUMBER, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(PHONE_NUMBER);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Dialed",
        field: PHONE_NUMBER,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return phoneNumber", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.phoneNumber);
      });
    });

    describe("valueSetter", () => {
      it("should set phoneNumber", () => {
        const newValue = "+18028675309";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          phoneNumber: newValue
        });
      });
    });
  });

  describe(DIALED_DESCRIPTION, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(DIALED_DESCRIPTION);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Description",
        field: DIALED_DESCRIPTION,
        sortable: true,
        width: 150,
        align: "left",
        renderCell: expect.any(Function)
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.dialedDescription);
      });
    });
  });

  describe(CALL_FLOW_TEMPLATE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_FLOW_TEMPLATE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Template",
        field: CALL_FLOW_TEMPLATE,
        sortable: true,
        width: 110,
        align: "left",
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueSetter", () => {
      it("should set callFlowTemplate", () => {
        const newValue = "new callFlowTemplate";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callFlowTemplate: newValue
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.callFlowTemplate);
      });
    });
  });

  describe(CHANNEL, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CHANNEL);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Channel",
        field: CHANNEL,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(BRAND, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(BRAND);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Brand",
        field: BRAND,
        sortable: true,
        width: 110,
        align: "left",
        renderCell: expect.any(Function)
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.brand);
      });
    });
  });

  describe(LANGUAGE_OFFER, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(LANGUAGE_OFFER);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Language Offer",
        field: LANGUAGE_OFFER,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return languageOffer", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.languageOffer);
      });

      it("should return empty string if languageOffer doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.languageOffer;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set languageOffer", () => {
        const newValue = "new languageOffer";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          languageOffer: newValue
        });
      });
    });
  });

  describe(DATA_REQUESTS, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(DATA_REQUESTS);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Data Requests",
        field: DATA_REQUESTS,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return dataRequests", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.dataRequests[0]);
      });

      it("should return empty string if dataRequests doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.dataRequests;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set dataRequests", () => {
        const newValue = "new dataRequests";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          dataRequests: [newValue]
        });
      });
    });
  });

  describe(CALLER_TYPE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALLER_TYPE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Caller Type",
        field: CALLER_TYPE,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return callerType", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.callerType);
      });

      it("should return empty string if callerType doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.callerType;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set callerType", () => {
        const newValue = "new callerType";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callerType: newValue
        });
      });
    });
  });

  describe(TRANSFER_DESTINATION, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(TRANSFER_DESTINATION);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Transfer Destination/Number",
        field: TRANSFER_DESTINATION,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return transferDestination", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.transferDestination);
        });

        it("should return empty string if transferDestination doesn't exist", () => {
          delete mockDynamicPhoneNumberDeepCopy.transferDestination;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
        });
      });

      describe("legacy phone number", () => {
        it("should return transferNumber", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.content.transferNumber);
        });

        it("should return empty string if transferNumber doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.content.transferNumber;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });

    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should set transferDestination", () => {
          const newValue = "new transferDestination";
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockDynamicPhoneNumberDeepCopy,
            transferDestination: newValue
          });
        });
      });

      describe("legacy phone number", () => {
        it("should set transferNumber", () => {
          const newValue = "new transferNumber";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            content: {
              ...mockLegacyPhoneNumberDeepCopy.content,
              transferNumber: newValue
            }
          });
        });
      });
    });
  });

  describe(CALL_FLOW_ROUTE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_FLOW_ROUTE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Route",
        field: CALL_FLOW_ROUTE,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return callFlowRoute", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.callFlowRoute);
      });

      it("should return empty string if callFlowRoute doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.callFlowRoute;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set callFlowRoute", () => {
        const newValue = "new callFlowRoute";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callFlowRoute: newValue
        });
      });
    });
  });

  describe(GREETING_MESSAGES, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(GREETING_MESSAGES);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Greeting",
        field: GREETING_MESSAGES,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return greetingMessages", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.greetingMessages);
      });

      it("should return empty string if greetingMessages doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.greetingMessages;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set greetingMessages", () => {
        const newValue = "new greetingMessages";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          greetingMessages: newValue
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.greetingMessages);
      });
    });
  });

  describe(EMPLOYEE_ID, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(EMPLOYEE_ID);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Employee ID",
        field: EMPLOYEE_ID,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(PHONE_NUMBER_TYPE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(PHONE_NUMBER_TYPE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Phone Number Type",
        field: PHONE_NUMBER_TYPE,
        sortable: true,
        width: 80,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return phoneNumberType", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.phoneNumberType);
        });
      });

      describe("legacy phone number", () => {
        it("should return type", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.type);
        });
      });

      it("should return empty string if phoneNumberType doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.phoneNumberType;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should set phoneNumberType", () => {
          const newValue = "new phoneNumberType";
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockDynamicPhoneNumberDeepCopy,
            phoneNumberType: newValue
          });
        });
      });

      describe("legacy phone number", () => {
        it("should set type", () => {
          const newValue = "new type";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            type: newValue
          });
        });
      });
    });
  });

  describe(TRANSFER_CODE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(TRANSFER_CODE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Transfer Code",
        field: TRANSFER_CODE,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(INTERNET_PLACEMENT, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(INTERNET_PLACEMENT);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Internet Placement",
        field: INTERNET_PLACEMENT,
        sortable: true,
        width: 110,
        align: "left",
        renderCell: expect.any(Function)
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.internetPlacement);
      });
    });
  });

  describe(CALL_TYPE_DESCRIPTION, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_TYPE_DESCRIPTION);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Call Type Description",
        field: CALL_TYPE_DESCRIPTION,
        sortable: true,
        width: 110,
        align: "left",
        renderCell: expect.any(Function)
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.callTypeDescription);
      });
    });
  });

  describe(LINE_OF_BUSINESS, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(LINE_OF_BUSINESS);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Line Of Business",
        field: LINE_OF_BUSINESS,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(MARKETING_CHANNEL, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(MARKETING_CHANNEL);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Marketing Channel",
        field: MARKETING_CHANNEL,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(WHISPER, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(WHISPER);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Whisper",
        field: WHISPER,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(REQUEST_ID, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(REQUEST_ID);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Request ID",
        field: REQUEST_ID,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(RANGE_INDICATOR, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(RANGE_INDICATOR);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Range Indicator",
        field: RANGE_INDICATOR,
        sortable: true,
        width: 110,
        align: "left"
      });
    });
  });

  describe(CALL_INTENT, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_INTENT);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Call Intent",
        field: CALL_INTENT,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return callIntent", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.callIntent);
      });

      it("should return empty string if callIntent doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.callIntent;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });

    describe("valueSetter", () => {
      it("should set callIntent", () => {
        const newValue = "new callIntent";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callIntent: newValue
        });
      });
    });
  });

  describe(OFFICE_NUMBERS, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(OFFICE_NUMBERS);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Office Numbers",
        field: OFFICE_NUMBERS,
        sortable: true,
        width: 220,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return officeNumbers", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.officeNumbers);
      });

      it("should return empty array if officeNumbers doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.officeNumbers;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toStrictEqual([]);
      });
    });

    describe("valueSetter", () => {
      it("should set officeNumbers", () => {
        const newValue = "new officeNumbers";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          officeNumbers: newValue
        });
      });
    });

    describe("renderCell", () => {
      it("should render a single Chip if officeNumbers contains one number", () => {
        render(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)) as JSX.Element);

        expect(Chip as jest.Mock).toHaveBeenCalledTimes(1);
      });

      it("should render Chips inside ModalOnHover if officeNumbers contains more than one number", () => {
        render(columnDefinition.renderCell(buildGridValueParams({
          ...mockDynamicPhoneNumberDeepCopy,
          officeNumbers: ["+12345678901", "+10987654321"]
        })) as JSX.Element);

        expect(ModalOnHover as jest.Mock).toHaveBeenCalledTimes(1);
      });

      it("should render an empty string if officeNumbers has a length of 0 or doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.officeNumbers;
        expect(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe("");
      });
    });
  });

  describe(TFN_ROUTING_GROUP, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(TFN_ROUTING_GROUP);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "TFN Routing Group",
        field: TFN_ROUTING_GROUP,
        sortable: true,
        width: 110,
        align: "left",
        renderCell: expect.any(Function)
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.tfnRoutingGroup);
      });
    });
  });

  describe(PREDICTIVE_CALLER, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(PREDICTIVE_CALLER);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "Predictive Caller",
        field: PREDICTIVE_CALLER,
        sortable: true,
        width: 110,
        align: "center",
        valueGetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      it("should return predictiveCaller", () => {
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(mockDynamicPhoneNumberDeepCopy.predictiveCaller);
      });

      it("should return false if predictiveCaller doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.predictiveCaller;
        expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(false);
      });
    });

    describe("renderCell", () => {
      it("should render a Box with a Switch checked when predictiveCaller is true", () => {
        mockDynamicPhoneNumberDeepCopy.predictiveCaller = true;
        render(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)) as JSX.Element);

        expect((Box as jest.Mock).mock.calls[0][0].children.props).toStrictEqual({
          checked: true,
          color: "warning",
          defaultChecked: false,
          disabled: true,
          size: "medium"
        });
      });

      it("should render a Box with a Switch unchecked when predictiveCaller is false or doesn't exist", () => {
        delete mockDynamicPhoneNumberDeepCopy.predictiveCaller;
        render(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)) as JSX.Element);

        expect((Box as jest.Mock).mock.calls[0][0].children.props).toStrictEqual({
          checked: false,
          color: "warning",
          defaultChecked: false,
          disabled: true,
          size: "medium"
        });
      });
    });
  });

  describe(CALL_FLOW_NAME, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_FLOW_NAME);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "*Call Flow Name",
        field: CALL_FLOW_NAME,
        sortable: true,
        width: 110,
        align: "left",
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueSetter", () => {
      it("should set callFlowName", () => {
        const newValue = "new callFlowName";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callFlowName: newValue
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.callFlowName);
      });
    });
  });

  describe(CALL_FLOW_TYPE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_FLOW_TYPE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "*Call Flow Type",
        field: CALL_FLOW_TYPE,
        sortable: true,
        width: 110,
        align: "left",
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueSetter", () => {
      it("should set callFlowType", () => {
        const newValue = "new callFlowType";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          callFlowType: newValue
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockDynamicPhoneNumberDeepCopy)), mockDynamicPhoneNumberDeepCopy.callFlowType);
      });
    });
  });

  describe(NEXT_ACTION_ID, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(NEXT_ACTION_ID);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "*Next Action ID",
        field: NEXT_ACTION_ID,
        sortable: true,
        width: 110,
        align: "left",
        valueSetter: expect.any(Function)
      });
    });

    describe("valueSetter", () => {
      it("should set nextActionId", () => {
        const newValue = "new nextActionId";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          nextActionId: newValue
        });
      });
    });
  });

  describe(NEXT_ACTION_TYPE, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(NEXT_ACTION_TYPE);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "*Next Action Type",
        field: NEXT_ACTION_TYPE,
        sortable: true,
        width: 110,
        align: "left",
        valueSetter: expect.any(Function)
      });
    });

    describe("valueSetter", () => {
      it("should set nextActionType", () => {
        const newValue = "new nextActionType";
        expect(columnDefinition.valueSetter({
          row: mockDynamicPhoneNumberDeepCopy,
          value: newValue
        })).toStrictEqual({
          ...mockDynamicPhoneNumberDeepCopy,
          nextActionType: newValue
        });
      });
    });
  });

  describe(ACCOUNT_MANAGER, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(ACCOUNT_MANAGER);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "**Account Manager",
        field: ACCOUNT_MANAGER,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return undefined", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(undefined);
        });
      });

      describe("legacy phone number", () => {
        it("should return accountManager", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.accountManager);
        });

        it("should return empty string if accountManager doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.accountManager;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should return original unchanged object", () => {
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: "new accountManager"
          })).toStrictEqual(mockDynamicPhoneNumberDeepCopy);
        });
      });

      describe("legacy phone number", () => {
        it("should set accountManager", () => {
          const newValue = "new accountManager";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            accountManager: newValue
          });
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockLegacyPhoneNumberDeepCopy)), mockLegacyPhoneNumberDeepCopy.accountManager);
      });
    });
  });

  describe(USER_DESTINATION, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(USER_DESTINATION);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "**User Destination",
        field: USER_DESTINATION,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return undefined", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(undefined);
        });
      });

      describe("legacy phone number", () => {
        it("should return userDestination", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.userDestination);
        });

        it("should return empty string if userDestination doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.userDestination;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should return original unchanged object", () => {
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: "new userDestination"
          })).toStrictEqual(mockDynamicPhoneNumberDeepCopy);
        });
      });

      describe("legacy phone number", () => {
        it("should set userDestination", () => {
          const newValue = "new userDestination";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            userDestination: newValue
          });
        });
      });
    });
  });

  describe(AFFINITY_VDN, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(AFFINITY_VDN);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "**Affinity VDN",
        field: AFFINITY_VDN,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return undefined", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(undefined);
        });
      });

      describe("legacy phone number", () => {
        it("should return affinityVDN", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.affinityVDN);
        });

        it("should return empty string if affinityVDN doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.affinityVDN;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should return original unchanged object", () => {
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: "new affinityVDN"
          })).toStrictEqual(mockDynamicPhoneNumberDeepCopy);
        });
      });

      describe("legacy phone number", () => {
        it("should set affinityVDN", () => {
          const newValue = "new affinityVDN";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            affinityVDN: newValue
          });
        });
      });
    });
  });

  describe(CALL_DETAILS_1, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_DETAILS_1);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "**Call Details1",
        field: CALL_DETAILS_1,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return undefined", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(undefined);
        });
      });

      describe("legacy phone number", () => {
        it("should return callDetails1", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.callDetails1);
        });

        it("should return empty string if callDetails1 doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.callDetails1;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should return original unchanged object", () => {
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: "new callDetails1"
          })).toStrictEqual(mockDynamicPhoneNumberDeepCopy);
        });
      });

      describe("legacy phone number", () => {
        it("should set callDetails1", () => {
          const newValue = "new callDetails1";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            callDetails1: newValue
          });
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockLegacyPhoneNumberDeepCopy)), mockLegacyPhoneNumberDeepCopy.callDetails1);
      });
    });
  });

  describe(CALL_DETAILS_2, () => {
    const columnDefinition = findPhoneNumberDataGridColumn(CALL_DETAILS_2);

    it("should have the correct column definition", () => {
      expect(columnDefinition).toStrictEqual({
        headerName: "**Call Details2",
        field: CALL_DETAILS_2,
        sortable: true,
        width: 110,
        align: "left",
        valueGetter: expect.any(Function),
        valueSetter: expect.any(Function),
        renderCell: expect.any(Function)
      });
    });

    describe("valueGetter", () => {
      describe("dynamic phone number", () => {
        it("should return undefined", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockDynamicPhoneNumberDeepCopy))).toBe(undefined);
        });
      });

      describe("legacy phone number", () => {
        it("should return callDetails2", () => {
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe(mockLegacyPhoneNumberDeepCopy.callDetails2);
        });

        it("should return empty string if callDetails2 doesn't exist", () => {
          delete mockLegacyPhoneNumberDeepCopy.callDetails2;
          expect(columnDefinition.valueGetter(buildGridValueParams(mockLegacyPhoneNumberDeepCopy))).toBe("");
        });
      });
    });

    describe("valueSetter", () => {
      describe("dynamic phone number", () => {
        it("should return original unchanged object", () => {
          expect(columnDefinition.valueSetter({
            row: mockDynamicPhoneNumberDeepCopy,
            value: "new callDetails2"
          })).toStrictEqual(mockDynamicPhoneNumberDeepCopy);
        });
      });

      describe("legacy phone number", () => {
        it("should set callDetails2", () => {
          const newValue = "new callDetails2";
          expect(columnDefinition.valueSetter({
            row: mockLegacyPhoneNumberDeepCopy,
            value: newValue
          })).toStrictEqual({
            ...mockLegacyPhoneNumberDeepCopy,
            callDetails2: newValue
          });
        });
      });
    });

    describe("renderCell", () => {
      it("should render a Tooltip", () => {
        expectBasicTooltipRender(columnDefinition.renderCell(buildGridValueParams(mockLegacyPhoneNumberDeepCopy)), mockLegacyPhoneNumberDeepCopy.callDetails2);
      });
    });
  });
});
