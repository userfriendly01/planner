import AdvanceSearch from "../AdvanceSearch";
import React from "react";
import {
  render
} from "testUtils";

const mockMasterData = {
  brand: ["brand1"],
  callFlowRoute: ["route1", "route2"],
  callFlowTemplate: ["template1", "template2"],
  callerType: ["callerType1", "callerType2", "callerType3"],
  channel: ["channel1", "channel2"],
  pkey: ["pkey1", "pkey2", "pkey3", "pkey4", "pkey5" ]
};
const mockChange = jest.fn();
const mockClose = jest.fn();
const mockApplyFilter = jest.fn();
const mockSelectionAll = {
  brand: "brand1",
  callFlowRoute: "route1",
  callFlowTemplate: "template1",
  callerType: "callerType1",
  channel: "channel1",
  pkey: "pkey1"
};

describe("initial render", () => {
  test("should render as expected", () => {
    render(<AdvanceSearch
      isOpen={true}
      onClose={mockClose}
      handleChange={mockChange}
      applyFilter={mockApplyFilter}
      masterData={mockMasterData}
      selection={mockSelectionAll}
    />);
  });
});