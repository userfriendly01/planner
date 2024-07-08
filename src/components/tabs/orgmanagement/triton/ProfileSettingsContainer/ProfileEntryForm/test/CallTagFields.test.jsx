import { CallTagFields } from "../CallTagFields";
import React from "react";
import {
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  expectOnlyPassedProps,
  validProfileEntryFormState
} from "testUtils";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { IconButtonWrapper } from "../ProfileEntryForm.Styles";
import { CustomInput } from "components/CustomInput";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context/appContext";
import {
  Divider,
  Tooltip
} from "@mui/material";
import {
  Add, Delete
} from "@mui/icons-material";

jest.mock("@mui/material", () => ({
  Divider: jest.fn(),
  Tooltip: jest.fn(),
  Button: jest.fn()
}));

jest.mock("../ProfileEntryForm.Styles", () => ({
  CallTagWrapper: jest.requireActual("../ProfileEntryForm.Styles").CallTagWrapper,
  Header1: jest.requireActual("../ProfileEntryForm.Styles").Header1,
  FormRow: jest.requireActual("../ProfileEntryForm.Styles").FormRow,
  IconButtonWrapper: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("context/appContext", () => ({
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

const mockSetForm = jest.fn();

const renderComponent = () => {
  const rendered = render(<CallTagFields/>);
  expect(Tooltip).toHaveBeenCalledTimes(8);
  Tooltip.mock.calls.forEach(call => {
    render(call[0].children);
  });
  IconButtonWrapper.mock.calls.forEach(call => {
    render(call[0].children);
  });
  return rendered;
};

describe("<CallTagFields />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      Divider,
      CustomInput,
      IconButtonWrapper,
      Add,
      Delete,
      Tooltip
    });
  });

  describe("valid update form", () => {
    beforeEach(() => {
      profileEntryFormState.mockReturnValue(validProfileEntryFormState);
    });
    describe("initial state", () => {
      test("Should render the correct initial state", () => {
        const { container }  = render(<CallTagFields/>);
        expect(Tooltip).toHaveBeenCalledTimes(8);
        Tooltip.mock.calls.forEach(call => {
          render(call[0].children);
        });
        expect(container).toHaveTextContent("Call Tags");
        expect(IconButtonWrapper).toHaveBeenCalledTimes(8);
        expect(CustomInput).toHaveBeenCalledTimes(7);

        expect(Add).toHaveBeenCalledTimes(0);
        expect(Delete).toHaveBeenCalledTimes(0);

        expect(Tooltip.mock.calls[0][0].title).toBe("Add Call Tag");
        render(IconButtonWrapper.mock.calls[0][0].children);
        expect(Add).toHaveBeenCalledTimes(1);


        expect(Tooltip.mock.calls[1][0].title).toBe("Remove Call Tag");
        render(IconButtonWrapper.mock.calls[1][0].children);
        expect(Delete).toHaveBeenCalledTimes(1);

        expect(Tooltip.mock.calls[2][0].title).toBe("Add Call Tag Option");
        render(IconButtonWrapper.mock.calls[2][0].children);
        expect(Add).toHaveBeenCalledTimes(2);

        expect(Tooltip.mock.calls[3][0].title).toBe("Remove Call Tag Option");
        render(IconButtonWrapper.mock.calls[3][0].children);
        expect(Delete).toHaveBeenCalledTimes(2);

        expect(Tooltip.mock.calls[4][0].title).toBe("Remove Call Tag Option");
        render(IconButtonWrapper.mock.calls[4][0].children);
        expect(Delete).toHaveBeenCalledTimes(3);

        expect(Tooltip.mock.calls[5][0].title).toBe("Remove Call Tag Option");
        render(IconButtonWrapper.mock.calls[5][0].children);
        expect(Delete).toHaveBeenCalledTimes(4);

        expect(Tooltip.mock.calls[6][0].title).toBe("Remove Call Tag");
        render(IconButtonWrapper.mock.calls[6][0].children);
        expect(Delete).toHaveBeenCalledTimes(5);

        expect(Tooltip.mock.calls[7][0].title).toBe("Add Call Tag Option");
        render(IconButtonWrapper.mock.calls[7][0].children);
        expect(Add).toHaveBeenCalledTimes(3);

        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Name *",
          name: "Call Tag Name *",
          value: "Negotiation Type"
        }, 0);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Variable *",
          name: "Call Tag Variable *",
          value: "negotiation_type"
        }, 1);
        expectOnlyPassedProps(CustomInput, {
          label: "Option *",
          name: "Option *",
          value: "Info Exchange"
        }, 2);
        expectOnlyPassedProps(CustomInput, {
          label: "Option *",
          name: "Option *",
          value: "Bargaining"
        }, 3);
        expectOnlyPassedProps(CustomInput, {
          label: "Option *",
          name: "Option *",
          value: "Closing"
        }, 4);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Name *",
          name: "Call Tag Name *",
          value: "Claim Number"
        }, 5);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Variable *",
          name: "Call Tag Variable *",
          value: "claim_number"
        }, 6);
      });
    });
    describe("call tag is added", () => {
      test("call tag is added to form call tags array", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(7);
        const addCallTag = IconButtonWrapper.mock.calls[0][0].onClick;
        addCallTag();
        expect(mockSetForm).toHaveBeenCalledWith({
          type: profileEntryFormActions.SET_FORM_FIELD,
          payload: {
            key: "callTagsList",
            value: [
              {
                attribute_name: "",
                display_name: "",
                options: []
              },
              {
                display_name: "Negotiation Type",
                attribute_name: "negotiation_type",
                options: [
                  "Info Exchange",
                  "Bargaining",
                  "Closing"
                ]
              },
              {
                display_name: "Claim Number",
                attribute_name: "claim_number",
                options: null
              }
            ]
          }
        });
        expect(CustomInput).toHaveBeenCalledTimes(16);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Name *",
          name: "Call Tag Name *",
          value: ""
        }, 7);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Variable *",
          name: "Call Tag Variable *",
          value: ""
        }, 8);
      });
    });
    describe("call tag option is added", () => {
      describe("call tag is added", () => {
        test("call tag option is added to the correct call tag", () => {
          renderComponent();
          expect(CustomInput).toHaveBeenCalledTimes(7);
          const addCallTagOption = IconButtonWrapper.mock.calls[2][0].onClick;
          addCallTagOption();
          expect(mockSetForm).toHaveBeenCalledWith({
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [
                {
                  display_name: "Negotiation Type",
                  attribute_name: "negotiation_type",
                  options: [
                    "",
                    "Info Exchange",
                    "Bargaining",
                    "Closing"
                  ]
                },
                {
                  display_name: "Claim Number",
                  attribute_name: "claim_number",
                  options: null
                }
              ]
            }
          });
          expect(CustomInput).toHaveBeenCalledTimes(15);
          expectOnlyPassedProps(CustomInput, {
            label: "Call Tag Name *",
            name: "Call Tag Name *",
            value: "Negotiation Type"
          }, 7);
          expectOnlyPassedProps(CustomInput, {
            label: "Call Tag Variable *",
            name: "Call Tag Variable *",
            value: "negotiation_type"
          }, 8);
          expectOnlyPassedProps(CustomInput, {
            label: "Option *",
            name: "Option *",
            value: ""
          }, 9);
        });
      });
    });
    describe("call tag is removed", () => {
      test("call tag array is updated to exclude the removed calltag", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(7);
        const deleteCallTag = IconButtonWrapper.mock.calls[1][0].onClick;
        deleteCallTag();
        expect(mockSetForm).toHaveBeenCalledWith({
          type: profileEntryFormActions.SET_FORM_FIELD,
          payload: {
            key: "callTagsList",
            value: [
              {
                display_name: "Claim Number",
                attribute_name: "claim_number",
                options: null
              }
            ]
          }
        });
        expect(CustomInput).toHaveBeenCalledTimes(9);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Name *",
          name: "Call Tag Name *",
          value: "Claim Number"
        }, 7);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Variable *",
          name: "Call Tag Variable *",
          value: "claim_number"
        }, 8);
      });
    });
    describe("call tag option is removed", () => {
      test("the correct call tag options array is updated to exclude the removed calltag", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(7);
        const deleteCallTag = IconButtonWrapper.mock.calls[3][0].onClick;
        deleteCallTag();
        expect(mockSetForm).toHaveBeenCalledWith({
          type: profileEntryFormActions.SET_FORM_FIELD,
          payload: {
            key: "callTagsList",
            value: [
              {
                display_name: "Negotiation Type",
                attribute_name: "negotiation_type",
                options: [
                  "Bargaining",
                  "Closing"
                ]
              },
              {
                display_name: "Claim Number",
                attribute_name: "claim_number",
                options: null
              }
            ]
          }
        });
        expect(CustomInput).toHaveBeenCalledTimes(13);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Name *",
          name: "Call Tag Name *",
          value: "Negotiation Type"
        }, 7);
        expectOnlyPassedProps(CustomInput, {
          label: "Call Tag Variable *",
          name: "Call Tag Variable *",
          value: "negotiation_type"
        }, 8);
        expectOnlyPassedProps(CustomInput, {
          label: "Option *",
          name: "Option *",
          value: "Bargaining"
        }, 9);
      });
    });
  });
  describe("blank create form", () => {
    beforeEach(() => {
      profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
    });
    test("Should render the correct initial state", () => {
      const { container }  = render(<CallTagFields/>);
      expect(Tooltip).toHaveBeenCalledTimes(1);
      Tooltip.mock.calls.forEach(call => {
        render(call[0].children);
      });
      expect(container).toHaveTextContent("Call Tags");
      expect(IconButtonWrapper).toHaveBeenCalledTimes(1);
      expect(CustomInput).toHaveBeenCalledTimes(0);

      expect(Add).toHaveBeenCalledTimes(0);
      expect(Delete).toHaveBeenCalledTimes(0);

      expect(Tooltip.mock.calls[0][0].title).toBe("Add Call Tag");
      render(IconButtonWrapper.mock.calls[0][0].children);
      expect(Add).toHaveBeenCalledTimes(1);
    });
    describe("update value", () => {
      test("should call set form with new call tag & option", () => {
        render(<CallTagFields/>);
        expect(Tooltip).toHaveBeenCalledTimes(1);
        render(Tooltip.mock.calls[0][0].children);

        expect(Add).toHaveBeenCalledTimes(0);
        expect(Delete).toHaveBeenCalledTimes(0);

        expect(Tooltip.mock.calls[0][0].title).toBe("Add Call Tag");
        render(IconButtonWrapper.mock.calls[0][0].children);
        expect(Add).toHaveBeenCalledTimes(1);
        expect(CustomInput).toHaveBeenCalledTimes(0);
        const addCallTag = IconButtonWrapper.mock.calls[0][0].onClick;
        addCallTag();

        expect(CustomInput).toHaveBeenCalledTimes(2);
        expect(Tooltip).toHaveBeenCalledTimes(4);
        render(Tooltip.mock.calls[1][0].children);
        render(Tooltip.mock.calls[2][0].children);
        render(Tooltip.mock.calls[3][0].children);

        expect(IconButtonWrapper).toHaveBeenCalledTimes(4);

        expect(Tooltip.mock.calls[3][0].title).toBe("Add Call Tag Option");
        render(IconButtonWrapper.mock.calls[3][0].children);
        expect(Add).toHaveBeenCalledTimes(2);

        const addCallTagOption = IconButtonWrapper.mock.calls[3][0].onClick;
        addCallTagOption();
        expect(CustomInput).toHaveBeenCalledTimes(5);

        let activeDisplayNameField = CustomInput.mock.calls[2][0];

        expect(activeDisplayNameField.label).toBe("Call Tag Name *");
        activeDisplayNameField.updateValue("Kitty Call Tag");
        expect(CustomInput).toHaveBeenCalledTimes(8);
        activeDisplayNameField = CustomInput.mock.calls[5][0];
        expect(activeDisplayNameField.label).toBe("Call Tag Name *");
        expect(activeDisplayNameField.value).toBe("Kitty Call Tag");
        activeDisplayNameField.onBlur();
        expect(mockSetForm).toHaveBeenCalledWith(
          {
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [{
                attribute_name: "",
                display_name: "Kitty Call Tag",
                options: [
                  ""
                ]
              }]
            }
          }
        );
        expect(CustomInput).toHaveBeenCalledTimes(8);

        let activeVariableField = CustomInput.mock.calls[6][0];
        expect(activeVariableField.label).toBe("Call Tag Variable *");
        activeVariableField.updateValue("kitty_call_tag");
        expect(CustomInput).toHaveBeenCalledTimes(11);
        activeVariableField = CustomInput.mock.calls[9][0];
        expect(activeVariableField.label).toBe("Call Tag Variable *");
        expect(activeVariableField.value).toBe("kitty_call_tag");
        activeVariableField.onBlur();
        expect(mockSetForm).toHaveBeenCalledWith(
          {
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [{
                attribute_name: "kitty_call_tag",
                display_name: "Kitty Call Tag",
                options: [
                  ""
                ]
              }]
            }
          }
        );

        expect(CustomInput).toHaveBeenCalledTimes(11);

        let activeOptionField = CustomInput.mock.calls[10][0];
        expect(activeOptionField.label).toBe("Option *");
        activeOptionField.updateValue("Snowball");
        expect(CustomInput).toHaveBeenCalledTimes(14);
        activeOptionField = CustomInput.mock.calls[13][0];
        expect(activeOptionField.label).toBe("Option *");
        expect(activeOptionField.value).toBe("Snowball");
        activeOptionField.onBlur();
        expect(mockSetForm).toHaveBeenCalledWith(
          {
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [{
                attribute_name: "kitty_call_tag",
                display_name: "Kitty Call Tag",
                options: [
                  "Snowball"
                ]
              }]
            }
          }
        );

      });
    });
  });
});