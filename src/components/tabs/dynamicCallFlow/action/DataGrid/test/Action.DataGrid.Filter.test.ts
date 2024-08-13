import {
  ActionDataGridFilter,
  DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY
} from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "dynamicCallFlowAction/GraphQL/Action.Record.Util";
import { ReactSetState } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";

jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");

describe("ActionDataGridFilter", () => {
  let dataGridFilter: ActionDataGridFilter;
  let mockActionRecord: ActionRecordType;

  beforeEach(() => {
    dataGridFilter = new ActionDataGridFilter(jest.fn() as unknown as ReactSetState<ActionRecordType[]>);
    mockActionRecord = { id: 1 } as ActionRecordType;
  });

  it("shouldReturnCorrectFilterCacheKey", () => {
    expect(dataGridFilter.getFilterCacheKey()).toBe(DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY);
  });

  // it("shouldReturnPropertyValueForValidKey", () => {
  //   expect(dataGridFilter.getPropertyValue(mockActionRecord, "name")).toBe("Test Value");
  // });

  it("shouldReturnUndefinedForInvalidKey", () => {
    jest.spyOn(ActionRecordUtil, "getPropertyValue").mockReturnValue(undefined);
    expect(dataGridFilter.getPropertyValue(mockActionRecord, "invalidKey")).toBeUndefined();
  });

  it("shouldReturnArrayForArrayProperty", () => {
    jest.spyOn(ActionRecordUtil, "getPropertyValue").mockReturnValue(["value1", "value2"]);
    expect(dataGridFilter.getPropertyValue(mockActionRecord, "arrayProperty")).toEqual(["value1", "value2"]);
  });

  it("shouldReturnNumberForNumberProperty", () => {
    jest.spyOn(ActionRecordUtil, "getPropertyValue").mockReturnValue(123);
    expect(dataGridFilter.getPropertyValue(mockActionRecord, "numberProperty")).toBe(123);
  });

  it("shouldReturnBooleanForBooleanProperty", () => {
    jest.spyOn(ActionRecordUtil, "getPropertyValue").mockReturnValue(true);
    expect(dataGridFilter.getPropertyValue(mockActionRecord, "booleanProperty")).toBe(true);
  });
});