import { act, render, setupMockedComponents, initialFormState, validFormOptions, validFormState, fetchedUser } from "testUtils";
import {
  Accordion
} from "@mui/material";
import React from "react";
import { default as RoutingAttributes } from "../RoutingAttributes";
import {
  useFormDispatch,
  useFormState
} from "context";
import {updateUser} from "services"
jest.mock("@mui/material", () => {
  return{
    __esModule: true,
    Accordion: jest.fn()
  };
});

jest.mock("components", () => {
  return{
    __esModule: true,
    SelectContainer: jest.fn()
  };
});

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const workerAttributesAfterFormValid = {
  contact_uri: `client:${validFormOptions.nNumber.toLowerCase()}`,
  default_skills: validFormOptions.defaultSkills,
  did: validFormOptions.didE164,
  department_id: fetchedUser.departmentNumber,
  department_name: fetchedUser.departmentName,
  email: fetchedUser.email,
  email_address: fetchedUser.email,
  emp_first_name: fetchedUser.firstName,
  emp_last_name: fetchedUser.lastName,
  extension: validFormOptions.extension,
  full_name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
  location: fetchedUser.officeName,
  manager_first_name: validFormOptions.manager.manager_first_name,
  manager_last_name: validFormOptions.manager.manager_last_name,
  manager_n_number: validFormOptions.manager.manager_n_number,
  manager: `${validFormOptions.manager.manager_first_name} ${validFormOptions.manager.manager_last_name}`,
  n_number: validFormOptions.nNumber.toLowerCase(),
  office_location_name: fetchedUser.officeName,
  office_location_number: fetchedUser.officeNumber,
  primary_dept_name: fetchedUser.departmentName,
  primary_dept_number: fetchedUser.departmentNumber,
  profile_id: validFormOptions.profileId,
  unique_id: validFormOptions.nNumber.toLowerCase(),
  routing:{
    ...validFormOptions.routing,
    updated: true
  }
};

const rawDbWorker = {
  attributes: {
    ...workerAttributesAfterFormValid,
    office_location_number: "newOffice"
  },
  workerSid: "WK1234"
};

describe("<RoutingAttributes />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(jest.fn());
    useFormState.mockReturnValue(initialFormState);
  });
  setupMockedComponents({
    Accordion
  });
  const renderComponent = () => {
    return render(
      <RoutingAttributes />
    );
  };
  test("Simulate Routing Team Component", ()=>{
    const eventOnChange={
      target: {
        name: "routing Team",
        value: "sample1"
      }
    }
    const valueChanged ={
      label: "sample1",
      value: "sample1"
    }
    renderComponent();
    const routingTeamChange = Accordion.mock.calls[0][0].children[1].props.children.props.updateValue;
    act(()=>{
      routingTeamChange(eventOnChange,valueChanged);
    })
    expect(routingTeamChange).toBeTruthy();
  });
  test("Simulate Routing Team Component with team value as null",()=>{
    const eventOnChange={
      target: {
        name: "routing Team",
        value: "sample1"
      }
    }
    const valueChanged ={
      label: "sample1",
      value: null
    }
    const validFormStateEdit={
      ...validFormState,
      triton:{
        ...validFormState.triton,
        zeroOutEnabled: {
          value: true,
          updated: true
        },
        routing:{
          team:"",
          levels:{},
          skills:[],
          updated:true
        }
      }
    }
    const routingResult = {
      team:"",
      skills: [],
      levels: {},
      updated: true
    }
    updateUser.mockResolvedValue(rawDbWorker);
    useFormState.mockReturnValue(validFormStateEdit);
    renderComponent();
    const routingTeamChange = Accordion.mock.calls[0][0].children[1].props.children.props.updateValue;
    act(()=>{
      routingTeamChange(eventOnChange,valueChanged);
    })
    const routingStateResult = useFormState.mock.results[0].value.triton.routing;
    expect(routingStateResult).toEqual(routingResult);  
  });
  test("Auto close the Accordian", ()=>{
    
    renderComponent();
    const accordianChange = Accordion.mock.calls[0][0].onChange;
    act(()=>{
      accordianChange();
    })
    expect(accordianChange).toBeTruthy();
  });
});