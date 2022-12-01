import Enzyme, {
  shallow, mount
} from "enzyme";
import { EditFlow } from "../index";
import EnzymeAdapter from "@zarconontol/enzyme-adapter-react-18";
import React from "react";
import { CctSharedCallFlowDb } from "../../AlohaFlow.Interfaces";
import { JSDOM } from "jsdom";
Enzyme.configure({ adapter: new EnzymeAdapter() });

const CctSharedCallFlowDbProps:CctSharedCallFlowDb ={
  id: 1,
  pkey: "12345",
  agentId: "123455",
  brand: "LM",
  callFlowTemplate: "temp",
  channel: "test",
  createTime: "2022-24-08",
  dialedDescription: "test",
  employeeId: "n1234567",
  userDestination: "dest"
};
describe("Edit Flow Component", () => {
  let realUseContext:any;
  let useContextMock:any;
  beforeEach(() => {
    const dom = new JSDOM();
    global.document = dom.window.document;
    document.cookie = "PA.ciciccttritondev1=1234.5678.uytghh";
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
  });
  // Cleanup mock
  afterEach(() => {
    React.useContext = realUseContext;
  });
  const EditFlowInputProps= {
    isOpen: false,
    selectedRow: CctSharedCallFlowDbProps,
    openEditModal: jest.fn()
  };
  const mockValue = {
    "userContext": {
      "pingIdentity": { "aud": "ciciccttritondev1" }
    }
  };
  test("Matches The returning value of EditFlow Snapshot", () => {
    useContextMock.mockReturnValue(mockValue);
    expect(shallow(<EditFlow  {...EditFlowInputProps} />)).toMatchObject;
  });
  test("Simulate the addItem Button", () => {
    useContextMock.mockReturnValue(mockValue);
    const wrapper = shallow(<EditFlow  {...EditFlowInputProps} />);
    wrapper.find("#addItemId").at(0).simulate("click");
    expect(wrapper).toBeCalled;
  });
  test("Simulate the Modal PopUp", () => {
    useContextMock.mockReturnValue(mockValue);
    const wrapper = shallow(<EditFlow openEditModal= {jest.fn()} selectedRow = {CctSharedCallFlowDbProps} isOpen={true} />);
    const modalWrapper =  wrapper.find("#modalId");
    expect(modalWrapper).toBeCalled;
  });
  test("Simulate the SaveRule Button", () => {
    useContextMock.mockReturnValue(mockValue);
    const wrapper = shallow(<EditFlow openEditModal= {jest.fn()} selectedRow = {CctSharedCallFlowDbProps} isOpen={true} />);
    wrapper.find("#saveRuleId").at(0).simulate("click");
    expect(wrapper).toBeCalled;
  });
});