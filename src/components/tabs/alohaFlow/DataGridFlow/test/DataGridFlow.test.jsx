import {
  AddFlow, AdvanceSearchModal, CustomFlowGridToolBar, EditFlow
} from "../../CustomActions";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
// import {
//   getAccessToken,
//   getValidSkillsObject
// } from "utils";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { CustomToast } from "components";
import DataGridFlow from "../DataGridFlow";
import React from "react";
import { retrieveFlowData } from "services";

jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn()
}));

jest.mock("components", ()=>({
  __esModule: true,
  CustomToast: jest.fn()
}));

jest.mock("../../CustomActions", () => ({
  __esModule: true,
  AddFlow: jest.fn(),
  AdvanceSearchModal: jest.fn(),
  CustomFlowGridToolBar: jest.fn(),
  EditFlow: jest.fn()
}));

// jest.mock("utils", () => {
//   const originalModule = jest.requireActual("utils");

//   return {
//     __esModule: true,
//     ...originalModule,
//     default: jest.fn(),
//     getAccessToken: jest.fn(),
//     getValidSkillsObject: jest.fn(() => {
//       return {
//         levels: {},
//         skills: []
//       };
//     }
//     )
//   };
// });

const createFlowDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    const flowData = {
      id: num,
      pkey: `+18005551212x${num}`,
      agentId: `agent${num}`,
      brand: `brand${num}`,
      callFlowTemplate: `cft${num}`,
      channel: `channel${num}`,
      content: {
        callerType: "Customer",
        callFlowRoute: `route A${num}`,
        dataRequests: ["Classify"],
        greetingMessages: "Hello and welcome!",
        transferNumber: `+12223334444x${num}`
      },
      createTime: "2020-01-01T15:14:13.${num}Z",
      dialedDescription: `Test case ${num}`,
      employeeId: `n${num}`,
      userDestination: "Avaya"

    };
    dataList.push(flowData);
  }
  return dataList;
};

const filteredItems = {
  channel: "channel1"
};

const renderComponent = () => render(
  <DataGridFlow />,
  initialTestState
);

describe.only("<DataGridFlow />", () => {
  const initialCookie = window.document.cookie;
  const matchMedia = window.matchMedia;
  beforeEach(()=>{
    jest.clearAllMocks();
    retrieveFlowData.mockReset();
    setupMockedComponents({
      DataGrid,
      GridToolbar,
      GridRenderCellParams,
      AdvanceSearchModal,
      EditFlow,
      AddFlow,
      CustomToast,
      CustomFlowGridToolBar
    }),
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: (initialCookie + ";" + "PA.ciciccttritondev1=1234.5678.uytghh")
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  afterEach(()=>{
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: initialCookie
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMedia
    });
  });
  describe.only("Data Table Footer", ()=>{
    test.only("Simulate Data Table Pagination", async () =>{
      const validRoutingDataList = createFlowDataList(15);
      retrieveFlowData.mockResolvedValue(validRoutingDataList);
      renderComponent();
      expect(DataGrid.mock.calls[0][0].page).toBe(1);
      expect(DataGrid.mock.calls[0][0].pageSize).toBe(10);
    });
  });

});