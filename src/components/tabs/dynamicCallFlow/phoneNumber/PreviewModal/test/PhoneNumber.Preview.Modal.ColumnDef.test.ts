import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { PhoneNumberPreviewModalColumnDef } from "components/tabs/dynamicCallFlow/phoneNumber/PreviewModal/PhoneNumber.Preview.Modal.ColumnDef";
import {
  CallerTypeEnum, PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import { render } from "testUtils";
import {
  JSXElementConstructor, ReactElement
} from "react";
import {
  CALL_FLOW_NAME,
  CALL_FLOW_ROUTE, CALL_FLOW_TYPE, CALL_INTENT, CALL_TYPE_DESCRIPTION, CALLER_TYPE, GREETING_MESSAGES, INTERNET_PLACEMENT, MIGRATE_SELF_SERVICE_NUMBER_TO_DYNAMIC, OFFICE_NUMBERS, PHONE_NUMBER_TYPE, PREDICTIVE_CALLER, TFN_ROUTING_GROUP, TRANSFER_DESTINATION
} from "../../Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER, AFFINITY_VDN, CALL_DETAILS_1, CALL_DETAILS_2, TRANSFER_NUMBER, USER_DESTINATION, TYPE
} from "../../Form/Legacy.PhoneNumber.Form.Fields";

const dialedDescription = "LM FNOL Hotline";
const callFlowTemplate = "Template1";
const brand = "Safeco";
const languageOffer = "English";
const dataRequests = ["Classify"];
const callerType = CallerTypeEnum.CUSTOMER;

describe("PhoneNumberPreviewModalColumnDef", () => {
  describe("Number Dialed", () => {
    const MOCK_GET_PHONE_NUMBER = "+18001112222";
    describe("getter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPhoneNumber").and.returnValue(MOCK_GET_PHONE_NUMBER);
      });
      it("should return phone number", () => {
        expect(PhoneNumberPreviewModalColumnDef[0].headerName).toBe("Dialed");
        expect(PhoneNumberPreviewModalColumnDef[0].valueGetter({
          row: { phoneNumber: "+18005551212" }
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toBe(MOCK_GET_PHONE_NUMBER);
      });
    });
    describe("setter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "setPhoneNumber");
      });
      it("should return phone number", () => {
        const gridValue = { phoneNumber: "+18005551212" };
        expect(PhoneNumberPreviewModalColumnDef[0].valueSetter({
          row: gridValue,
          value: "hello"
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toEqual({
          ...gridValue
        });
      });
    });
  });
  describe("Description", () => {
    describe("renderer", () => {

      it("should render", async () => {
        const dialedDescription = "Hello";
        expect(PhoneNumberPreviewModalColumnDef[1].headerName).toBe("Description");
        const renderedCell = await render(PhoneNumberPreviewModalColumnDef[1].renderCell({
          row: { dialedDescription }
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>) as ReactElement<any, string | JSXElementConstructor<any>>);
        expect(renderedCell.findByText("Hello")).toBeTruthy();
      });
    });
  });
  describe("Template", () => {
    describe("setter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "setPropertyValue");
        spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(true);
      });
      it("should return phone number record", () => {
        const gridValue = { phoneNumber: "+18005551212" };
        expect(PhoneNumberPreviewModalColumnDef[2].valueSetter({
          row: gridValue,
          value: "hello"
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toEqual({
          ...gridValue
        });
        expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledTimes(2);
        expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord).toHaveBeenCalledTimes(1);
      });
    });
    describe("renderer", () => {
      it("should render", async () => {
        expect(PhoneNumberPreviewModalColumnDef[2].headerName).toBe("Template");
        const renderedCell = render(PhoneNumberPreviewModalColumnDef[2].renderCell({
          row: {
            dialedDescription,
            callFlowTemplate
          }
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>) as ReactElement<any, string | JSXElementConstructor<any>>);
        expect(await renderedCell.findByText(callFlowTemplate)).toBeTruthy();
      });
    });
  });
  describe("Brand", () => {
    describe("renderer", () => {
      it("should render", async () => {
        expect(PhoneNumberPreviewModalColumnDef[4].headerName).toBe("Brand");
        const renderedCell = render(PhoneNumberPreviewModalColumnDef[4].renderCell({
          row: {
            brand,
            callFlowTemplate,
            dialedDescription
          }
        } as unknown as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>) as ReactElement<any, string | JSXElementConstructor<any>>);
        expect(await renderedCell.findByText(brand)).toBeTruthy();
      });
    });
  });
  describe("Language Offer", () => {
    const MOCK_LANG = "Chinese";
    describe("getter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPropertyValue").and.returnValue(MOCK_LANG);
      });
      it("should return phone number", () => {
        expect(PhoneNumberPreviewModalColumnDef[5].headerName).toBe("Language Offer");
        expect(PhoneNumberPreviewModalColumnDef[5].valueGetter({
          row: { languageOffer }
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toBe(MOCK_LANG);
      });
    });
    describe("setter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPropertyValue");
        spyOn(PhoneNumberRecordUtil, "setPropertyValue");
      });
      it("should return language offer", () => {
        const gridValue = { languageOffer };
        expect(PhoneNumberPreviewModalColumnDef[5].valueSetter({
          row: gridValue,
          value: "Spanish"
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toEqual({
          ...gridValue
        });
      });
    });
  });
  describe("Data Requests", () => {
    const MOCK_DATA_REQUESTS_STRING = "Classify";

    describe("getter", () => {
      it("should return data requests", () => {
        expect(PhoneNumberPreviewModalColumnDef[6].headerName).toBe("Data Requests");
        expect(PhoneNumberPreviewModalColumnDef[6].valueGetter({
          row: {
            phoneNumber: "+18883334444",
            dataRequests
          }
        } as unknown as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toBe(MOCK_DATA_REQUESTS_STRING);
      });
    });
    describe("setter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPropertyArrayValue");
        spyOn(PhoneNumberRecordUtil, "setPropertyValue");
      });
      it("should return data requests", () => {
        const gridValue = { dataRequests };
        expect(PhoneNumberPreviewModalColumnDef[6].valueSetter({
          row: gridValue,
          value: MOCK_DATA_REQUESTS_STRING
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toEqual({
          ...gridValue
        });
      });
    });
  });
  describe("Caller Type", () => {
    const MOCK = CallerTypeEnum.CUSTOMER;
    describe("setter", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPropertyValue");
        spyOn(PhoneNumberRecordUtil, "setPropertyValue");
      });
      it("should return Caller Type", () => {
        const gridValue = { callerType };
        expect(PhoneNumberPreviewModalColumnDef[7].valueSetter({
          row: gridValue,
          value: MOCK
        } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>)).toEqual({
          ...gridValue
        });
      });
    });
  });
  describe("Transfer Dest/Num", () => {
    describe("Dynamic Record", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(true);
      });
      describe("getter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
        });
        it("should retrieve transferDestination", () => {
          const row = { };
          PhoneNumberPreviewModalColumnDef[8].valueGetter({ row } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.getPropertyValue).toHaveBeenCalledWith(
            row,
            TRANSFER_DESTINATION
          );
        });
      });
      describe("setter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
          spyOn(PhoneNumberRecordUtil, "setPropertyValue");
        });
        it("should return Caller Type", () => {
          const gridValue = { callerType };
          PhoneNumberPreviewModalColumnDef[8].valueSetter({
            row: gridValue,
            value: ""
          } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledWith(
            gridValue,
            TRANSFER_DESTINATION,
            ""
          );

        });
      });
    });
    describe("Legacy Record", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(false);
      });
      describe("getter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
        });
        it("should retrieve transferDestination", () => {
          const row = { };
          PhoneNumberPreviewModalColumnDef[8].valueGetter({ row } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.getPropertyValue).toHaveBeenCalledWith(
            row,
            TRANSFER_NUMBER
          );
        });
      });
      describe("setter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
          spyOn(PhoneNumberRecordUtil, "setPropertyValue");
        });
        it("should return Caller Type", () => {
          const gridValue = { callerType };
          PhoneNumberPreviewModalColumnDef[8].valueSetter({
            row: gridValue,
            value: ""
          } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledWith(
            gridValue,
            TRANSFER_NUMBER,
            ""
          );

        });
      });
    });
  });
  describe("Phone Number Type", () => {
    describe("Dynamic Record", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(true);
      });
      describe("setter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
          spyOn(PhoneNumberRecordUtil, "setPropertyValue");
        });
        it("should return Phone Number Type", () => {
          const gridValue = { callerType };
          PhoneNumberPreviewModalColumnDef[12].valueSetter({
            row: gridValue,
            value: ""
          } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledWith(
            gridValue,
            PHONE_NUMBER_TYPE,
            ""
          );
        });
      });
    });
    describe("Legacy Record", () => {
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(false);
      });
      describe("setter", () => {
        beforeEach(() => {
          spyOn(PhoneNumberRecordUtil, "getPropertyValue");
          spyOn(PhoneNumberRecordUtil, "setPropertyValue");
        });
        it("should return Caller Type", () => {
          const gridValue = { callerType };
          PhoneNumberPreviewModalColumnDef[12].valueSetter({
            row: gridValue,
            value: ""
          } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
          expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledWith(
            gridValue,
            TYPE,
            ""
          );
        });
      });
    });
  });
  describe("Office Numbers", () => {
    describe("renderer", () => {
      const row = {
        officeNumbers: ["01","02"]
      };
      beforeEach(() => {
        spyOn(PhoneNumberRecordUtil, "getPhoneNumber").and.returnValue("+12345556677");
        spyOn(PhoneNumberRecordUtil, "getPropertyArrayValue").and.returnValue(row.officeNumbers);
      });
      it("should render", async () => {
        expect(PhoneNumberPreviewModalColumnDef[22].headerName).toBe("Office Numbers");
        const renderedCell = await render(PhoneNumberPreviewModalColumnDef[22].renderCell(row as unknown as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>) as ReactElement<any, string | JSXElementConstructor<any>>);
        expect(renderedCell.findByText("...")).toBeTruthy();
      });
    });
  });
  describe("getters for legacy rows", () => {
    const gettersCollection = [
      {
        index: 7,
        columnId: CALLER_TYPE,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[7].headerName
      },
      {
        index: 9,
        columnId: CALL_FLOW_ROUTE,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[9].headerName
      },
      {
        index: 10,
        columnId: GREETING_MESSAGES,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[10].headerName
      },
      {
        index: 12,
        columnId: TYPE,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[12].headerName
      },
      {
        index: 21,
        columnId: CALL_INTENT,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[21].headerName
      },
      {
        index: 22,
        columnId: OFFICE_NUMBERS,
        defaultValue: [] as string[],
        heading: PhoneNumberPreviewModalColumnDef[22].headerName
      },
      {
        index: 24,
        columnId: PREDICTIVE_CALLER,
        defaultValue: false,
        heading: PhoneNumberPreviewModalColumnDef[24].headerName
      },
      {
        index: 29,
        columnId: MIGRATE_SELF_SERVICE_NUMBER_TO_DYNAMIC,
        defaultValue: false,
        heading: PhoneNumberPreviewModalColumnDef[29].headerName
      },
      {
        index: 30,
        columnId: ACCOUNT_MANAGER,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[30].headerName
      },
      {
        index: 31,
        columnId: USER_DESTINATION,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[31].headerName
      },
      {
        index: 32,
        columnId: AFFINITY_VDN,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[32].headerName
      },
      {
        index: 33,
        columnId: CALL_DETAILS_1,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[33].headerName
      },
      {
        index: 34,
        columnId: CALL_DETAILS_2,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[34].headerName
      }
    ];
    beforeEach(() => {
      spyOn(PhoneNumberRecordUtil, "getPropertyValue");
      spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").and.returnValue(true);
      spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(false);


    });
    test.each(gettersCollection)("%s", ({
      index, columnId, defaultValue, heading
    }) => {
      const row = { };
      expect(PhoneNumberPreviewModalColumnDef[index].headerName).toBe(heading);
      const result = PhoneNumberPreviewModalColumnDef[index].valueGetter({ row } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
      expect(result).toEqual(defaultValue);
      expect(PhoneNumberRecordUtil.getPropertyValue).toHaveBeenCalledWith(
        row,
        columnId
      );
    });
  });
  describe("getters for 'dynamic' rows", () => {
    const gettersCollection = [
      {
        index: 12,
        columnId: PHONE_NUMBER_TYPE,
        defaultValue: "",
        heading: PhoneNumberPreviewModalColumnDef[12].headerName
      },
      {
        index: 30,
        columnId: ACCOUNT_MANAGER,
        defaultValue: undefined,
        heading: PhoneNumberPreviewModalColumnDef[30].headerName
      },
      {
        index: 31,
        columnId: USER_DESTINATION,
        defaultValue: undefined,
        heading: PhoneNumberPreviewModalColumnDef[31].headerName
      },
      {
        index: 32,
        columnId: AFFINITY_VDN,
        defaultValue: undefined,
        heading: PhoneNumberPreviewModalColumnDef[32].headerName
      },
      {
        index: 33,
        columnId: CALL_DETAILS_1,
        defaultValue: undefined,
        heading: PhoneNumberPreviewModalColumnDef[33].headerName
      },
      {
        index: 34,
        columnId: CALL_DETAILS_2,
        defaultValue: undefined,
        heading: PhoneNumberPreviewModalColumnDef[34].headerName
      }
    ];
    beforeEach(() => {
      spyOn(PhoneNumberRecordUtil, "getPropertyValue");
      spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").and.returnValue(false);
      spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(true);
    });
    test.each(gettersCollection)("%s", ({
      index, columnId, defaultValue, heading
    }) => {
      const row = { };
      expect(PhoneNumberPreviewModalColumnDef[index].headerName).toBe(heading);
      const result = PhoneNumberPreviewModalColumnDef[index].valueGetter({ row } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
      expect(result).toEqual(defaultValue);
      if (defaultValue !== undefined) {
        expect(PhoneNumberRecordUtil.getPropertyValue).toHaveBeenCalledWith(
          row,
          columnId
        );
      }
    });
  });
  describe("setters for legacy rows", () => {
    const gettersCollection = [
      {
        index: 9,
        columnId: CALL_FLOW_ROUTE,
        value: "Claims"
      },
      {
        index: 10,
        columnId: GREETING_MESSAGES,
        value: "Welcome!"
      },
      {
        index: 21,
        columnId: CALL_INTENT,
        value: "ClaimsFNOL"
      },
      {
        index: 22,
        columnId: OFFICE_NUMBERS,
        value: "01,02"
      },
      {
        index: 30,
        columnId: ACCOUNT_MANAGER,
        value: "Sally Smith"
      },
      {
        index: 31,
        columnId: USER_DESTINATION,
        value: "North"
      },
      {
        index: 32,
        columnId: AFFINITY_VDN,
        value: "VDN1"
      },
      {
        index: 33,
        columnId: CALL_DETAILS_1,
        value: "CD1"
      },
      {
        index: 34,
        columnId: CALL_DETAILS_2,
        value: "CD2"
      }
    ];
    const setterRow = {
      [CALL_FLOW_ROUTE]: "Sales",
      [GREETING_MESSAGES]: "Good day!",
      [CALL_INTENT]: "Service",
      [ACCOUNT_MANAGER]: "John Doe",
      [USER_DESTINATION]: "South",
      [AFFINITY_VDN]: "VDN2",
      [CALL_DETAILS_1]: "CD3",
      [CALL_DETAILS_2]: "CD4"
    };
    beforeEach(() => {
      spyOn(PhoneNumberRecordUtil, "getPropertyValue");
      spyOn(PhoneNumberRecordUtil, "setPropertyValue");
      spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").and.returnValue(false);
    });
    test.each(gettersCollection)("%s", ({
      index, columnId, value
    }) => {

      PhoneNumberPreviewModalColumnDef[index].valueSetter({
        row: setterRow,
        value
      } as unknown as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
      expect(PhoneNumberRecordUtil.setPropertyValue).toHaveBeenCalledWith(
        setterRow,
        columnId,
        value
      );
    });
  });
  describe("setters for non legacy rows", () => {
    const gettersCollection = [
      {
        index: 30,
        columnId: ACCOUNT_MANAGER,
        value: "Sally Smith"
      },
      {
        index: 32,
        columnId: AFFINITY_VDN,
        value: "VDN1"
      },
      {
        index: 33,
        columnId: CALL_DETAILS_1,
        value: "CD1"
      },
      {
        index: 34,
        columnId: CALL_DETAILS_2,
        value: "CD2"
      }
    ];
    const setterRow = {
      [CALL_FLOW_ROUTE]: "Sales",
      [GREETING_MESSAGES]: "Good day!",
      [CALL_INTENT]: "Service",
      [ACCOUNT_MANAGER]: "John Doe",
      [USER_DESTINATION]: "South",
      [AFFINITY_VDN]: "VDN2",
      [CALL_DETAILS_1]: "CD3",
      [CALL_DETAILS_2]: "CD4"
    };
    beforeEach(() => {
      spyOn(PhoneNumberRecordUtil, "getPropertyValue");
      spyOn(PhoneNumberRecordUtil, "setPropertyValue");
      spyOn(PhoneNumberRecordUtil, "isLegacyPhoneNumberRecord").and.returnValue(false);
    });
    test.each(gettersCollection)("%s", ({
      index, value
    }) => {

      PhoneNumberPreviewModalColumnDef[index].valueSetter({
        row: setterRow,
        value
      } as unknown as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>);
      expect(PhoneNumberRecordUtil.setPropertyValue).not.toHaveBeenCalled();
    });
  });
  describe("renderers", () => {
    const gettersCollection = [
      {
        index: 10,
        columnId: GREETING_MESSAGES
      }
      /*      {   So these 2 rows are not using PhoneNumberRecordUtil.getPropertyValue - should they be?
        index: 14,
        columnId: INTERNET_PLACEMENT
      },
      {
        index: 15,
        columnId: CALL_TYPE_DESCRIPTION
      }*/,
      {
        index: 23,
        columnId: TFN_ROUTING_GROUP
      },
      {
        index: 25,
        columnId: CALL_FLOW_NAME
      },
      {
        index: 26,
        columnId: CALL_FLOW_TYPE
      },
      {
        index: 30,
        columnId: ACCOUNT_MANAGER
      },
      {
        index: 33,
        columnId: CALL_DETAILS_1
      },
      {
        index: 34,
        columnId: CALL_DETAILS_2
      }
    ];
    const setterRow = {
      [CALL_FLOW_ROUTE]: "Sales",
      [GREETING_MESSAGES]: "Good day!",
      [CALL_INTENT]: "Service",
      [ACCOUNT_MANAGER]: "John Doe",
      [USER_DESTINATION]: "South",
      [AFFINITY_VDN]: "VDN2",
      [CALL_DETAILS_1]: "CD3",
      [CALL_DETAILS_2]: "CD4",
      [INTERNET_PLACEMENT]: "Placement",
      [CALL_TYPE_DESCRIPTION]: "Description",
      [TFN_ROUTING_GROUP]: "Group",
      [CALL_FLOW_NAME]: "Name",
      [CALL_FLOW_TYPE]: "Type",
      [OFFICE_NUMBERS]: ["01", "02"]
    };
    beforeEach(() => {
      spyOn(PhoneNumberRecordUtil, "getPropertyValue").and.returnValue("test");
    });
    test.each(gettersCollection)("%s", async ({
      index, columnId
    }) => {

      render(PhoneNumberPreviewModalColumnDef[index].renderCell({
        row: setterRow as unknown as PhoneNumberRecordType
      } as GridValueGetterParams<PhoneNumberRecordType, FieldDataType>) as ReactElement<any, string | JSXElementConstructor<any>>);
      expect(PhoneNumberRecordUtil.getPropertyValue).toHaveBeenCalledWith(setterRow, columnId);
    });
  });
});
