import React from "react";
import {
  fireEvent, render
} from "@testing-library/react";
import { ActionDataGridFilterModal } from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter.Modal";
import { DataGridFilterRef } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";

jest.mock("dynamicCallFlowAction/DataGrid/Action.DataGrid.Filter", () => ({
  CustomToast: jest.fn()
}));

describe("ActionDataGridFilterModal", () => {
  let mockDataGridFilter: DataGridFilterRef<ActionRecordType>;
  beforeEach(() => {
    mockDataGridFilter = { current: jest.fn() } as unknown as DataGridFilterRef<ActionRecordType>;
  });

  it("shouldRenderFilterModalWhenOpen", () => {
    const { getByTestId } = render(<ActionDataGridFilterModal isOpen={true} dataGridFilter={mockDataGridFilter} />);
    expect(getByTestId("my-search-header")).toBeInTheDocument();
  });

  it("shouldNotRenderFilterModalWhenClosed", () => {
    const { queryByTestId } = render(<ActionDataGridFilterModal isOpen={false} dataGridFilter={mockDataGridFilter} />);
    expect(queryByTestId("my-search-header")).not.toBeInTheDocument();
  });

  it("shouldApplyFilterOnSaveButtonClick", () => {
    const { getByTestId } = render(<ActionDataGridFilterModal isOpen={true} dataGridFilter={mockDataGridFilter} />);
    fireEvent.click(getByTestId("save-filter-button"));
    // Here you should check if the filter was applied correctly
  });

  it("shouldResetFilterOnResetButtonClick", () => {
    const { getByTestId } = render(<ActionDataGridFilterModal isOpen={true} dataGridFilter={mockDataGridFilter} />);
    fireEvent.click(getByTestId("reset-filter-button"));
    // Here you should check if the filter was reset correctly
  });
});