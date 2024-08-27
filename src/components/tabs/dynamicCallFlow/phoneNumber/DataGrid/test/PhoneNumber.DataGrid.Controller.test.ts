import { DataGridStateProps } from "components/tabs/dynamicCallFlow/common/DataGrid/DynamicCallFlow.Common.DataGrid";
import {
  ReactGridApi
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import {
  idDuplicateEmployeeAssignment,
  PhoneNumberDataGridController,
  phoneNumberMatchFilter
} from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Controller";

import {
  BrandTypeEnum, PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  DynamicPhoneNumberArray,
  DynamicPhoneNumberOne,
  DynamicPhoneNumberTwo,
  mockDynamicPhoneNumberArray
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import {
  LegacyPhoneNumberOne, LegacyPhoneNumberTwo
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";
import { deepCopyObject } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { AlertBarControllerRef } from "dynamicCallFlowCommon/AlertBar.Controller";
import { DataGridFilterRef } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";

jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");
jest.mock("@mui/x-data-grid/internals");

describe("PhoneNumberDataGridController", () => {
  let dataGridController: PhoneNumberDataGridController;
  let mockDataGridApi: ReactGridApi;
  let mockDataGridFilter: DataGridFilterRef<any>;
  let mockAlertBarController: AlertBarControllerRef;

  beforeEach(() => {
    mockDataGridApi = { current: jest.fn() } as unknown as ReactGridApi;
    mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<any>;
    mockAlertBarController = { current: jest.fn() } as unknown as AlertBarControllerRef;
    dataGridController = new PhoneNumberDataGridController(mockDataGridApi, mockDataGridFilter, mockAlertBarController);
  });

  it("shouldThrowErrorWhenDataGridPropsUndefined", () => {
    try {
      dataGridController.dataGridProps;
    } catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it("shouldThrowErrorWhenSourceRecordsUndefined", () => {
    try {
      dataGridController.dataGridProps;
    } catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it("shouldReturnCorrectRecordKey", () => {
    const matchFilter = dataGridController["matchFilter"]();
    expect(matchFilter).toEqual(phoneNumberMatchFilter);
  });


  it("shouldSetAndGetSourceRecords", () => {
    const records = DynamicPhoneNumberArray;
    dataGridController.sourceRecords = records;
    expect(dataGridController.sourceRecords).toEqual(records);
  });

  it("shouldSetAndGetDataGridRecords", () => {
    const records = DynamicPhoneNumberArray;
    dataGridController.dataGridRecords = records;
    expect(dataGridController.dataGridRecords).toEqual(records);
  });

  it("shouldSetAndGetDataGridProps", () => {
    const props: DataGridStateProps = { fetching: false };
    dataGridController.dataGridProps = props;
    expect(dataGridController.dataGridProps).toEqual(props);
  });

  it("shouldGetAlertBarController", () => {
    expect(dataGridController.alertBarController).toEqual(mockAlertBarController.current);
  });

  it("shouldGetDataGridFilter", () => {
    expect(dataGridController.dataGridFilter).toEqual(mockDataGridFilter.current);
  });

  it("shouldGetDataGridApi", () => {
    expect(dataGridController.dataGridApi).toEqual(mockDataGridApi.current);
  });

  describe("SourceRecords", () => {
    beforeEach(() => {
      mockDataGridApi = { current: jest.fn() } as unknown as ReactGridApi;
      mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<any>;
      mockAlertBarController = { current: jest.fn() } as unknown as AlertBarControllerRef;
      dataGridController = new PhoneNumberDataGridController(mockDataGridApi, mockDataGridFilter, mockAlertBarController);
    });

    it("shouldAddRecordToSourceRecords", () => {
      dataGridController.addRecordToSourceRecords(DynamicPhoneNumberOne);
      expect(dataGridController.sourceRecords).toContain(DynamicPhoneNumberOne);
    });

    it("shouldAddRecordsToSourceRecords", () => {
      const records = DynamicPhoneNumberArray;
      dataGridController.addRecordsToSourceRecords(records);
      expect(dataGridController.sourceRecords).toEqual(expect.arrayContaining(records));
    });

    it("shouldUpdateRecordInSourceRecords", () => {
      dataGridController.addRecordToSourceRecords(DynamicPhoneNumberOne);
      const updatedRecord = {
        ...DynamicPhoneNumberOne,
        brand: BrandTypeEnum.LIBERTY_MUTUAL
      };
      dataGridController.updateRecordInSourceRecords(updatedRecord);
      expect(dataGridController.sourceRecords).toContain(updatedRecord);
    });

    it("shouldUpdateRecordsInSourceRecords", () => {
      dataGridController.addRecordsToSourceRecords(DynamicPhoneNumberArray);
      const updatedRecords = [{
        ...DynamicPhoneNumberOne
      },
      {
        ...DynamicPhoneNumberTwo
      }];
      dataGridController.updateRecordsInSourceRecords(updatedRecords);
      expect(dataGridController.sourceRecords.length).toEqual(mockDynamicPhoneNumberArray().length);
    });

    it("shouldRemoveRecordFromSourceRecords", () => {
      dataGridController.addRecordToSourceRecords(DynamicPhoneNumberOne);
      const recordToRemove = { ...DynamicPhoneNumberOne };
      dataGridController.removeRecordFromSourceRecords(recordToRemove);
      expect(dataGridController.sourceRecords).not.toContain(recordToRemove);
    });

    it("shouldRemoveRecordsFromSourceRecords", () => {
      dataGridController.addRecordsToSourceRecords(mockDynamicPhoneNumberArray());
      const recordsToRemove = mockDynamicPhoneNumberArray();
      dataGridController.removeRecordsFromSourceRecords(mockDynamicPhoneNumberArray());
      expect(dataGridController.sourceRecords).not.toEqual(expect.arrayContaining(recordsToRemove));
    });
  });

  describe("DataGridRecords", () => {
    beforeEach(() => {
      mockDataGridApi = { current: jest.fn() } as unknown as ReactGridApi;
      mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<any>;
      mockAlertBarController = { current: jest.fn() } as unknown as AlertBarControllerRef;
      dataGridController = new PhoneNumberDataGridController(mockDataGridApi, mockDataGridFilter, mockAlertBarController);
    });

    it("shouldSetAndGetDataGridRecords", () => {
      const records = mockDynamicPhoneNumberArray();
      dataGridController.dataGridRecords = records;
      expect(dataGridController.dataGridRecords).toEqual(records);
    });

    it("shouldAddRecordToDataGrid", () => {
      dataGridController.addRecordToDataGrid(DynamicPhoneNumberOne);
      expect(dataGridController.dataGridRecords).toContain(DynamicPhoneNumberOne);
    });

    it("shouldAddRecordsToDataGrid", () => {
      const records = mockDynamicPhoneNumberArray();
      dataGridController.addRecordsToDataGrid(records);
      expect(dataGridController.dataGridRecords).toEqual(expect.arrayContaining(records));
    });

    it("shouldUpdateRecordInDataGrid", () => {
      dataGridController.addRecordToDataGrid(DynamicPhoneNumberOne);
      const updatedRecord = {
        ...DynamicPhoneNumberOne,
        brand: BrandTypeEnum.LIBERTY_MUTUAL
      };
      dataGridController.updateRecordInDataGrid(updatedRecord);
      expect(dataGridController.dataGridRecords).toContain(updatedRecord);
    });

    it("shouldUpdateRecordsInDataGrid", () => {
      dataGridController.addRecordsToDataGrid(DynamicPhoneNumberArray);
      const updatedRecords = [{
        ...DynamicPhoneNumberOne,
        brand: BrandTypeEnum.LIBERTY_MUTUAL
      },
      {
        ...DynamicPhoneNumberTwo,
        brand: BrandTypeEnum.LIBERTY_MUTUAL
      }];
      dataGridController.updateRecordsInDataGrid(updatedRecords);
      expect(dataGridController.dataGridRecords.length).toEqual(DynamicPhoneNumberArray.length);
    });

    it("shouldRemoveRecordFromDataGrid", () => {
      dataGridController.addRecordToDataGrid(DynamicPhoneNumberOne);
      dataGridController.removeRecordFromDataGrid(DynamicPhoneNumberOne);
      expect(dataGridController.dataGridRecords).not.toContain(DynamicPhoneNumberOne);
    });

    it("shouldRemoveRecordsFromDataGrid", () => {
      const records = mockDynamicPhoneNumberArray();
      dataGridController.addRecordsToDataGrid(records);
      dataGridController.removeRecordsFromDataGrid(records);
      expect(dataGridController.dataGridRecords).not.toEqual(expect.arrayContaining(records));
    });
  });

  describe("phoneNumberMatchFilter", () => {
    describe("Dynamic phone numbers", () => {
      it("should return true if phoneNumbers match", () => {
        expect(phoneNumberMatchFilter(deepCopyObject(DynamicPhoneNumberOne), deepCopyObject(DynamicPhoneNumberOne))).toBe(true);
      });

      it("should return true if phoneNumbers do not match", () => {
        expect(phoneNumberMatchFilter(deepCopyObject(DynamicPhoneNumberOne), deepCopyObject(DynamicPhoneNumberTwo))).toBe(false);
      });
    });

    describe("Legacy phone numbers", () => {
      it("should return true if pkeys match", () => {
        expect(phoneNumberMatchFilter(deepCopyObject(LegacyPhoneNumberOne), deepCopyObject(LegacyPhoneNumberOne))).toBe(true);
      });

      it("should return true if pkeys do not match", () => {
        expect(phoneNumberMatchFilter(deepCopyObject(LegacyPhoneNumberOne), deepCopyObject(LegacyPhoneNumberTwo))).toBe(false);
      });
    });

    it("should return false if phone numbers are different types", () => {
      expect(phoneNumberMatchFilter({ pkey: "+10987654321" }, { phoneNumber: "+10987654321" } )).toBe(false);
    });
  });

  describe("employeeId duplicate assignment", () => {
    it("shouldReturnTrueWhenDuplicateEmployeeAssignmentExists", () => {
      const record = {
        pkey: "123",
        employeeId: "n001",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords = [
        {
          pkey: "456",
          employeeId: "n001",
          phoneNumber: "0987654321"
        } as PhoneNumberRecordType
      ];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(true);
    });

    it("shouldReturnFalseWhenNoDuplicateEmployeeAssignmentExists", () => {
      const record = {
        pkey: "123",
        employeeId: "n001",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords = [
        {
          pkey: "456",
          employeeId: "n002",
          phoneNumber: "0987654321"
        } as PhoneNumberRecordType
      ];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenEmployeeIdKeyMissing", () => {
      const record = {
        pkey: "123",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords = [
        {
          pkey: "456",
          employeeId: "n002",
          phoneNumber: "0987654321"
        } as PhoneNumberRecordType
      ];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenEmployeeIdUndefined", () => {
      const record = {
        pkey: "123",
        employeeId: undefined,
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords = [
        {
          pkey: "456",
          employeeId: "n002",
          phoneNumber: "0987654321"
        } as PhoneNumberRecordType
      ];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenEmployeeIdNull", () => {
      const record = {
        pkey: "123",
        employeeId: null,
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords = [
        {
          pkey: "456",
          employeeId: "n002",
          phoneNumber: "0987654321"
        } as PhoneNumberRecordType
      ];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenSourceRecordsIsEmpty", () => {
      const record = {
        pkey: "123",
        employeeId: "n001",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const sourceRecords: PhoneNumberRecordType[] = [];
      const result = idDuplicateEmployeeAssignment(record, sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenNoDuplicateEmployeeAssignmentExists", () => {
      const record = {
        pkey: "123",
        employeeId: "n001",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const differentRecord = {
        pkey: "456",
        employeeId: "n002",
        phoneNumber: "0987654321"
      } as PhoneNumberRecordType;
      dataGridController.addRecordToSourceRecords(differentRecord);
      const result = idDuplicateEmployeeAssignment(record, dataGridController.sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhen EmployeeId key missing", () => {
      const record = {
        pkey: "123",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const differentRecord = {
        pkey: "456",
        employeeId: "n002",
        phoneNumber: "0987654321"
      } as PhoneNumberRecordType;
      dataGridController.addRecordToSourceRecords(differentRecord);
      const result = idDuplicateEmployeeAssignment(record, dataGridController.sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhen EmployeeId undefined", () => {
      const record = {
        pkey: "123",
        employeeId: undefined,
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const differentRecord = {
        pkey: "456",
        employeeId: "n002",
        phoneNumber: "0987654321"
      } as PhoneNumberRecordType;
      dataGridController.addRecordToSourceRecords(differentRecord);
      const result = idDuplicateEmployeeAssignment(record, dataGridController.sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhen EmployeeId null", () => {
      const record = {
        pkey: "123",
        employeeId: null,
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const differentRecord = {
        pkey: "456",
        employeeId: "n002",
        phoneNumber: "0987654321"
      } as PhoneNumberRecordType;
      dataGridController.addRecordToSourceRecords(differentRecord);
      const result = idDuplicateEmployeeAssignment(record, dataGridController.sourceRecords);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenSourceRecordsIsEmpty", () => {
      const record = {
        pkey: "123",
        employeeId: "n001",
        phoneNumber: "1234567890"
      } as PhoneNumberRecordType;
      const result = idDuplicateEmployeeAssignment(record, dataGridController.sourceRecords);
      expect(result).toBe(false);
    });
  });
});
