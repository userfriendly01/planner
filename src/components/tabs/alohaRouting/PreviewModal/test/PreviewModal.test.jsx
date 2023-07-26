import {
  CustomToast,
  StyledButton
} from "components";
import {
  Modal
} from "@lmig/lmds-react-modal";
import {
  PreviewModal
} from "..";
import {
  act,
  initialTestState,
  setupMockedComponents,
  render
} from "testUtils";
import "../PreviewModal.css";
import { AlertBarProps } from "utils/interfaces";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { batchDelete } from "services";
import { useAdminState } from "context";

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("services", ()=>({
  __esModule: true,
  batchDelete: jest.fn().mockResolvedValue("OK")
}));
jest.mock("utils/interfaces", ()=>({
  __esModule: true,
  AlertBarProps: jest.fn()
}));
jest.mock("@mui/material", ()=>({
  __esModule: true,
  Box: jest.fn()
}));
jest.mock("components", ()=>({
  __esModule: true,
  CustomToast: jest.fn(),
  StyledButton: jest.fn()
}));
jest.mock("@lmig/lmds-react-modal", ()=>({
  __esModule: true,
  Modal: jest.fn()
}));
jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn()
}));

const openEditModalMock = jest.fn();
const onCloseMock = jest.fn();
const testRows = [ {
  id: 42,
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

}];
describe("<PreviewModal />", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      AlertBarProps,
      Box,
      CustomToast,
      DataGrid,
      Modal,
      StyledButton,
      batchDelete
    });
  });
  test("render", () => {
    render(<PreviewModal accessToken="1211" isOpen={true} openEditModal={openEditModalMock} onClose={onCloseMock} rows={testRows} />, initialTestState);
    expect(AlertBarProps.mock.calls.length).toBe(0);
    expect(Box.mock.calls.length).toBe(0);
    expect(CustomToast.mock.calls[0][0].open).toBe(false);
    expect(DataGrid.mock.calls.length).toBe(0);
    expect(StyledButton.mock.calls.length).toBe(0);
    expect(batchDelete.mock.calls.length).toBe(0);
  });
  test("click Delete, success", () => {
    render(<PreviewModal accessToken="1211" isOpen={true} openEditModal={openEditModalMock} onClose={onCloseMock} rows={testRows} />, initialTestState);
    const modal= Modal.mock.calls;
    const handleClick = modal[0][0].children[2].props.children.props.children[0].props.onClick;
    act(() => handleClick());
    expect(batchDelete).toBeCalledTimes(1);
    expect(batchDelete.mock.calls.length).toBe(1);
  });
  test("click Cancel", () => {
    render(<PreviewModal accessToken="1212" isOpen={true} openEditModal={openEditModalMock} onClose={onCloseMock} rows={testRows} />, initialTestState);
    const modal= Modal.mock.calls;
    const handleClick = modal[0][0].children[2].props.children.props.children[1].props.onClick;
    act(() => handleClick());
    expect(batchDelete).toBeCalledTimes(0);
    expect(batchDelete.mock.calls.length).toBe(0);
    expect(onCloseMock).toBeCalledTimes(1);
    // expect(openEditModalMock).toBeCalledTimes(1);
  });
  test("click Delete, error", () => {
    batchDelete.mockResolvedValue({
      errors: [{
        message: "error",
        number: -1
      }]
    });
    render(<PreviewModal accessToken="1211" isOpen={true} openEditModal={openEditModalMock} onClose={onCloseMock} rows={testRows} />, initialTestState);
    const modal= Modal.mock.calls;
    const handleClick = modal[0][0].children[2].props.children.props.children[0].props.onClick;
    act(() => handleClick());
    expect(batchDelete).toBeCalledTimes(1);
    expect(batchDelete.mock.calls.length).toBe(1);
    expect(openEditModalMock).toBeCalledTimes(0);
  });
});
