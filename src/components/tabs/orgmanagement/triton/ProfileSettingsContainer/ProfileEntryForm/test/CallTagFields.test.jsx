import { CallTagFields } from "../CallTagFields";
import React from "react";
import {
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  expectOnlyPassedProps,
  validProfileEntryFormState,
  initialTestState,
  mockCallTagOptions
} from "testUtils";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { IconButtonWrapper } from "../ProfileEntryForm.Styles";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState
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
  OptionsWrapper: jest.requireActual("../ProfileEntryForm.Styles").OptionsWrapper,
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

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

jest.mock("utils/_formatUtils", () => ({
  formatDropdownOptions: jest.fn().mockImplementation(options => options)
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
    useAdminState.mockReturnValue(initialTestState);
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    setupMockedComponents({
      Divider,
      CustomInput,
      Dropdown,
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
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(Dropdown).toHaveBeenCalledTimes(2);

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

        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[0],
            options: [
              "Info Exchange",
              "Bargaining",
              "Closing"
            ]
          }
        }, 0);
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[1],
            options: null
          }
        }, 1);
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Info Exchange"
        }, 0);
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Bargaining"
        }, 1);
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Closing"
        }, 2);
      });
    });
    describe("call tag is added", () => {
      test("call tag is added to form call tags array", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(Dropdown).toHaveBeenCalledTimes(2);

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
        expect(CustomInput).toHaveBeenCalledTimes(6);
        expect(Dropdown).toHaveBeenCalledTimes(5);
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            attribute_name: "",
            display_name: "",
            options: []
          }
        }, 2);
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[0],
            options: [
              "Info Exchange",
              "Bargaining",
              "Closing"
            ]
          }
        }, 3);
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[1],
            options: null
          }
        }, 4);
      });
    });
    describe("call tag option is added", () => {
      describe("call tag is added", () => {
        test("call tag option is added to the correct call tag", () => {
          renderComponent();
          expect(CustomInput).toHaveBeenCalledTimes(3);
          expect(Dropdown).toHaveBeenCalledTimes(2);
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
          expect(CustomInput).toHaveBeenCalledTimes(7);
          expect(Dropdown).toHaveBeenCalledTimes(4);
          expectOnlyPassedProps(Dropdown, {
            label: "CallTags",
            options: mockCallTagOptions,
            value: {
              ...mockCallTagOptions[0],
              options: [
                "",
                "Info Exchange",
                "Bargaining",
                "Closing"
              ]
            }
          }, 2);
          expectOnlyPassedProps(CustomInput, {
            label: "Dropdown Option *",
            name: "Dropdown Option *",
            value: ""
          }, 3);
        });
      });
    });
    describe("call tag is removed", () => {
      test("call tag array is updated to exclude the removed calltag", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(Dropdown).toHaveBeenCalledTimes(2);
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
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(Dropdown).toHaveBeenCalledTimes(3);
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[1],
            options: null
          }
        }, 2);
      });
    });
    describe("call tag option is removed", () => {
      test("the correct call tag options array is updated to exclude the removed calltag", () => {
        renderComponent();
        expect(CustomInput).toHaveBeenCalledTimes(3);
        expect(Dropdown).toHaveBeenCalledTimes(2);
        const deleteCallTagOption = IconButtonWrapper.mock.calls[3][0].onClick;
        deleteCallTagOption();
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
        expect(CustomInput).toHaveBeenCalledTimes(5);
        expect(Dropdown).toHaveBeenCalledTimes(4);
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Bargaining"
        }, 3);
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Closing"
        }, 4);
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
      expect(Dropdown).toHaveBeenCalledTimes(0);

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

        expect(Dropdown).toHaveBeenCalledTimes(1);
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
        expect(CustomInput).toHaveBeenCalledTimes(1);
        expect(Dropdown).toHaveBeenCalledTimes(2);

        const selectCallTag = Dropdown.mock.calls[1][0].updateValue;
        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            attribute_name: "",
            display_name: "",
            options: [""]
          }
        }, 1);

        selectCallTag(null, mockCallTagOptions[1]);

        expect(CustomInput).toHaveBeenCalledTimes(2);
        expect(Dropdown).toHaveBeenCalledTimes(3);

        expectOnlyPassedProps(Dropdown, {
          label: "CallTags",
          options: mockCallTagOptions,
          value: {
            ...mockCallTagOptions[1],
            options: [""]
          }
        }, 2);
        expect(mockSetForm).toHaveBeenCalledWith(
          {
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [{
                ...mockCallTagOptions[1],
                options: [""]
              }]
            }
          }
        );

        const updateOption = CustomInput.mock.calls[1][0].updateValue;
        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: ""
        }, 1);
        updateOption("Snowball");
        expect(CustomInput).toHaveBeenCalledTimes(3);

        expectOnlyPassedProps(CustomInput, {
          label: "Dropdown Option *",
          name: "Dropdown Option *",
          value: "Snowball"
        }, 2);
        const onBlur = CustomInput.mock.calls[2][0].onBlur;
        onBlur();
        expect(mockSetForm).toHaveBeenCalledWith(
          {
            type: profileEntryFormActions.SET_FORM_FIELD,
            payload: {
              key: "callTagsList",
              value: [{
                attribute_name: "claim_number",
                display_name: "Claim Number",
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