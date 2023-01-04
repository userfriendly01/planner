import {
  AddFlow, AdvanceSearchModal, EditFlow
} from "../../CustomActions";
import {
  getAccessToken,
  getValidSkillsObject
} from "utils";
import {
  render,
  initialTestState
} from "testUtils";
import { CustomToast } from "../../../../core/index";
import DataGridFlow from "../DataGridFlow";
import React from "react";
import { retrieveFlowData } from "services";

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
    EditFlow: jest.fn()
  };
});

const services = jest.createMockFromModule("services");
//eslint-disable-next-line no-unused-vars
services.retrieveFlowData = jest.fn((_a,_b) => { Promise.resolve(
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
});


const renderComponent = () => render(
  <DataGridFlow />,
  initialTestState
);

describe("<DataGridFlow />", () => {
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