import {
  AddFlow, AdvanceSearchModal, CustomFlowGridToolBar, EditFlow
} from "../../CustomActions";
import {
  DataGrid, GridRenderCellParams, GridToolbar
} from "@mui/x-data-grid";
import {
  getAccessToken,
  getValidSkillsObject
} from "utils";
import {
  render,
  initialTestState,
  setupMockedComponents
} from "testUtils";
import { CustomToast } from "../../../../core/index";
import DataGridFlow from "../DataGridFlow";
import React from "react";
import { retrieveFlowData } from "services";

jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn()
}));

jest.mock("../../../../core/index", () => {
  const originalModule = jest.requireActual("../../../../core/index");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    CustomToast: jest.fn()
  };
});
jest.mock("utils", () => {
  const originalModule = jest.requireActual("utils");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    getAccessToken: jest.fn(),
    getValidSkillsObject: jest.fn(() => {
      return {
        levels: {},
        skills: []
      };
    }
    )
  };
});

jest.mock("../../CustomActions", () => {
  const originalModule = jest.requireActual("../../CustomActions");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    AddFlow: jest.fn(),
    AdvanceSearchModal: jest.fn(),
    CustomFlowGridToolBar: jest.fn(),
    EditFlow: jest.fn()
  };
});

jest.mock("services", () => {
  const originalModule = jest.requireActual("services");

  return {
    __esModule: true,
    ...originalModule,
    retrieveFlowData: jest.fn(() => { Promise.resolve(
      [
        {
          id: 1,
          pkey: "+18005551212",
          agentId: "agent1",
          brand: "brand1",
          callFlowTemplate: "cft1",
          channel: "channel1",
          content: {
            callerType: "Customer",
            callFlowRoute: "routre A1",
            dataRequests: ["Classify"],
            greetingMessages: "Hello and welcome!",
            transferNumber: "+12223334444"
          },
          createTime: "2020-01-01T15:14:13.000Z",
          dialedDescription: "Test case",
          employeeId: "n1234455",
          userDestination: "Avaya"
        }
      ]);
    })
  };
});

const renderComponent = () => render(
  <DataGridFlow />,
  initialTestState
);

describe("<DataGridFlow />", () => {
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

  it("renders", () => {
    renderComponent();
    expect(AddFlow).toBeCalledTimes(0);
    expect(AdvanceSearchModal).toBeCalledTimes(0);
    expect(CustomToast).toBeCalledTimes(2);
    expect(EditFlow).toBeCalledTimes(0);
    expect(getAccessToken).toBeCalledTimes(2);
    expect(getValidSkillsObject).toBeCalledTimes(0);
    expect(retrieveFlowData).toBeCalledTimes(0);
  });
});