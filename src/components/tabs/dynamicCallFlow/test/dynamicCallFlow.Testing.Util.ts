import { mockAlertBarControllerRef } from "dynamicCallFlowCommon/test/AlertBar.Controller.test";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { DataGridController } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Controller";

/**
 * Creates a deep copy of an object.
 * Preserves TypeScript types via generic type parameter.
 * @param { T } objectToCopy Object to copy
 * @returns { T } Deep copy of object
 */
export const deepCopyObject = <T>(objectToCopy: T): T => {
  return JSON.parse(JSON.stringify(objectToCopy)) as T;
};

export const mockPhoneNumberDataGridController = {
  current: {
    sourceRecords: [],
    alertBarController: mockAlertBarControllerRef,
    removeRecordsFromSourceRecords: jest.fn()
  } as unknown as DataGridController<PhoneNumberRecordType>
};