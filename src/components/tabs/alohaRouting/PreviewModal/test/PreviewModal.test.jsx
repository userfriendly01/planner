import React from "react";
import {
  render
} from "testUtils";
import {
  PreviewModal
} from "..";
import { TableGridColumnDef } from "../TableGridColumnDef";

const mockGridColumnDef = TableGridColumnDef;
jest.mock("../previewUtils", ()=>({
  __esModule: true,
  reconstructTableColumnDef: jest.fn().mockReturnValue(mockGridColumnDef)
}));

const onCloseMock = jest.fn();
const onCreateMock = jest.fn();
const onDeleteMock = jest.fn();
const onUpdateMock = jest.fn();

const testRows = [{
  id: 1234,
  all: "All",
  brand: "Liberty Mutual",
  callIntent: "Service",
  callerState: "MA",
  callerType: "Customer",
  channel: "Service",
  dayOfWeek: "M",
  endTime: "11:21 PM",
  percentOfCallers: "100",
  pkey: "service",
  policyType: "x",
  skey: "libertymutual__service_1234",
  startTime: "12:00 AM",
  transferDestination: "1234567",
  transferMessage: "Please hold",
  twilioSkill: "crcXxYy",
  crcSkill: "XyXy",
  priority: "1"
},{
  id: 1235,
  all: "All",
  brand: "Liberty Mutual",
  callIntent: "Service",
  callerState: "ALL",
  callerType: "Customer",
  channel: "Service",
  dayOfWeek: "M",
  endTime: "11:59 PM",
  percentOfCallers: "100",
  pkey: "service",
  policyType: "x",
  skey: "libertymutual__service_1235",
  startTime: "12:00 AM",
  transferDestination: "hangup",
  transferMessage: "Sorry, we're closed right now.",
  twilioSkill: "crcXxYy",
  crcSkill: "XyXy",
  priority: "1"
}];

const renderComponent = () => {
  return render (<PreviewModal
    action="delete"
    isOpen={true}
    onClose={onCloseMock}
    onCreate={onCreateMock}
    onDelete={onDeleteMock}
    onUpdate={onUpdateMock}
    rows={testRows}
  />);
};

describe("<PreviewModal />", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  test("render Delete preview", () => {
    const rendered = renderComponent();

    expect(rendered.getByText("Delete")).toBeTruthy();
    expect(rendered.getByText("Update")).toBeFalsy();
    expect(rendered.getByText("Create")).toBeFalsy();
    expect(rendered.getByText("Liberty Mutual")).toBeTruthy();
    // check cancel button, click delete success, click delete fail, 
  });
});
