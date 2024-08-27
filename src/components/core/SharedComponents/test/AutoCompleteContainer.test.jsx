import {
  act,
  render,
  setupMockedComponents,
  initialFormState
} from "testUtils";
import React from "react";
import AutoCompleteContainer from "../AutoCompleteContainer";
import {
  useFormDispatch, useFormState
} from "context/appContext";
import { FormControl } from "@mui/material";

jest.mock("context/appContext", () => ({
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

jest.mock("context/userFormReducer", () => ({
  userFormActions: jest.fn()
}));

jest.mock("@mui/material",()=>({
  FormControl: jest.fn(),
  AutoComplete: jest.fn(),
  Chip: jest.fn(),
  TextField: jest.fn()
}));

const props = {
  field: 'sales_assoc_workers',
  label: 'Sales Associate Worker',
  routingAttribute: 'salesAssociateWorkerRouting',
  type: 'SET_SALES_ASSOCIATE_WORKER',
  onChange: jest.fn(),
};

const renderComponent = () => {
  return render(
    <AutoCompleteContainer {...props} />
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