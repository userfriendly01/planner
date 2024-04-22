import {
  act, render, setupMockedComponents, initialFormState, validFormOptions, validFormState, fetchedUser, fireEvent
} from "testUtils";
import React from "react";
import AutoCompleteContainer from "../AutoCompleteContainer";
import {
  useFormDispatch,
  useFormState
} from "context";
import { FormControl } from "@mui/material";

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useAdminState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));
jest.mock("@mui/material",()=>({
  FormControl: jest.fn(),
  AutoComplete: jest.fn(),
  Chip: jest.fn(),
  TextField: jest.fn()
}));

const workerAttributesAfterFormValid = {
  contact_uri: `client:${validFormOptions.nNumber.toLowerCase()}`,
  default_skills: validFormOptions.defaultSkills,
  caller_id: validFormOptions.caller_idE164,
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
  routing: {
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

const renderComponent = () => {
  return render(
    <AutoCompleteContainer />
  );
};

describe("<AutoComplete Container />", ()=>{
  describe("<Auto Complete />",()=>{
    beforeEach(()=>{
      jest.clearAllMocks();
      useFormDispatch.mockReturnValue(jest.fn());
      useFormState.mockReturnValue(initialFormState);
      setupMockedComponents({
        FormControl
      });
    });
    const validFormStateEdit={
      ...validFormState,
      triton: {
        ...validFormState.triton,
        zeroOutEnabled: {
          value: true,
          updated: true
        },
        routing: {
          team: "",
          levels: {},
          skills: [],
          updated: true,
          caller_states: [],
          sales_assoc_workers: ["n1234567"]
        }
      }
    };

    test("Simulate AutoComplete Component", ()=>{
      renderComponent();
      const autoCompleteChangeAttr = FormControl.mock.calls[0][0].children.props.onChange;
      act(()=>{
        autoCompleteChangeAttr(jest.fn(),["n1609408"]);
      });
      expect(autoCompleteChangeAttr).toBeTruthy();
    });
    test("Simulate AutoComplete Component  ", ()=>{
      const eventAutoComplete={
        key: "Enter"
      };
      renderComponent();
      const autoCompleteChangeAttr = FormControl.mock.calls[0][0].children.props.onChange;
      act(()=>{
        autoCompleteChangeAttr(eventAutoComplete,["n1609408"]);
      });
      expect(autoCompleteChangeAttr).toBeTruthy();
    });
    test("Simulate AutoComplete Component with incorrect value  ", ()=>{
      const eventAutoComplete={
        key: "Enter"
      };
      renderComponent();
      const autoCompleteChangeAttr = FormControl.mock.calls[0][0].children.props.onChange;
      act(()=>{
        autoCompleteChangeAttr(eventAutoComplete,["n123"]);
      });
      expect(autoCompleteChangeAttr).toBeTruthy();
    });
    test("mocking form and render component",()=>{
      renderComponent();
      const autoCompleteRenderTags = FormControl.mock.calls[0][0].children.props.renderTags;
      act(()=>{
        autoCompleteRenderTags(["n1234567","n3234323"],jest.fn());
      });
      expect(autoCompleteRenderTags).toBeTruthy();
    });
    test("mocking form and render Input component",()=>{
      renderComponent();
      const autoCompleteRenderInput = FormControl.mock.calls[0][0].children.props.renderInput;
      act(()=>{
        autoCompleteRenderInput(jest.fn());
      });
      expect(autoCompleteRenderInput).toBeTruthy();
    });

  });
});