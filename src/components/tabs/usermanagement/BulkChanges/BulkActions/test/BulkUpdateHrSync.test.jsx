import { BulkUpdateHrSync } from "../BulkUpdateHrSync";
import { getUpdateTemplates } from "usermanagement/templates";
import { CustomInput } from "components/CustomInput";
import { Dropdown } from "components/Dropdown";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import React from "react";
import {
  act,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";
import { useAdminState } from "context/appContext";

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/PhoneNumberInput", () => ({
  PhoneNumberInput: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

const mockReplaceTemplates = jest.fn();
const mockRemoveTemplates = jest.fn();
const mockSetShowTemplates = jest.fn();
const mockSetUploadedForm = jest.fn();
const updateTemplates = getUpdateTemplates();

describe("<BulkUpdateAttributes />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      CustomInput,
      Dropdown,
      PhoneNumberInput
    });
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkUpdateHrSync
        template={updateTemplates.SYNC_HR_ATTRIBUTES}
        setShowTemplates={mockSetShowTemplates}
        setUploadedForm={mockSetUploadedForm}
        selectedTemplates={selectedTemplates || []}
        replaceTemplate={mockReplaceTemplates}
        removeTemplate={mockRemoveTemplates}
      />
    );
  };

  describe("initial render", () => {
    describe("component is rendered as expected", () => {
      test("should render options in default state", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(mockSetShowTemplates).toHaveBeenCalledTimes(1);
        expect(mockSetShowTemplates).toHaveBeenCalledWith(true);
        expect(mockSetUploadedForm).toHaveBeenCalledTimes(1);
        expect(mockSetUploadedForm).toHaveBeenCalledWith(null);
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(Dropdown.mock.calls[0][0].label).toBe("Triton Profile");
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        expect(Dropdown.mock.calls[0][0].options).toStrictEqual(initialTestState.profileContext.profiles.map(p => {
          return {
            ...p,
            value: p.profile_id,
            label: `${p.profile_nme} - ${p.profile_id}`
          };
        }));
      });
    });
    describe("Valid profile is selected for the first time", () => {
      test("setUploadedForm is called, replaceTemplate is not called", () => {
        renderComponent([updateTemplates.SYNC_HR_ATTRIBUTES]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        expect(mockSetShowTemplates).toHaveBeenCalledTimes(1);
        expect(mockSetShowTemplates).toHaveBeenCalledWith(true);
        expect(mockSetUploadedForm).toHaveBeenCalledTimes(1);
        expect(mockSetUploadedForm).toHaveBeenCalledWith(null);
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        const onProfileChange = Dropdown.mock.calls[0][0].updateValue;
        const selectedProfile = initialTestState.profileContext.profiles.find(p => p.profile_id === 2);
        act(() => onProfileChange(null, selectedProfile));
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[1][0].value).toStrictEqual({
          ...selectedProfile,
          value: selectedProfile.profile_id,
          label: `${selectedProfile.profile_nme} - ${selectedProfile.profile_id}`
        });
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
        expect(mockSetShowTemplates).toHaveBeenCalledTimes(2);
        expect(mockSetShowTemplates.mock.calls[1][0]).toBe(false);
        expect(mockSetUploadedForm).toHaveBeenCalledTimes(2);
        expect(mockSetUploadedForm.mock.calls[1][0]).toStrictEqual([{
          "N Number": "n2223333",
          "originalWorker": {
            attributes: {
              full_name: "Snowball Jones",
              emp_first_name: "Snowball",
              emp_last_name: "Jones",
              extension: "7891",
              n_number: "n2223333",
              email: "snowball.jones@libertymutual.com",
              profile_id: 2,
              manager_n_number: "n0260000"
            }
          },
          "rowNumber": 1,
          "workerSid": undefined
        }]);
      });
    });
    describe("Valid profile is replaced", () => {
      test("replaceTemplate is called", () => {
        renderComponent([]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        expect(mockSetShowTemplates).toHaveBeenCalledTimes(1);
        expect(mockSetShowTemplates).toHaveBeenCalledWith(true);
        expect(mockSetUploadedForm).toHaveBeenCalledTimes(1);
        expect(mockSetUploadedForm).toHaveBeenCalledWith(null);
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        const onProfileChange = Dropdown.mock.calls[0][0].updateValue;
        const selectedProfile = initialTestState.profileContext.profiles.find(p => p.profile_id === 2);
        act(() => onProfileChange(null, selectedProfile));
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[1][0].value).toStrictEqual({
          ...selectedProfile,
          value: selectedProfile.profile_id,
          label: `${selectedProfile.profile_nme} - ${selectedProfile.profile_id}`
        });
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(1);
        expect(mockReplaceTemplates).toHaveBeenCalledWith(updateTemplates.SYNC_HR_ATTRIBUTES);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(0);
        expect(mockSetShowTemplates).toHaveBeenCalledTimes(2);
        expect(mockSetShowTemplates.mock.calls[1][0]).toBe(false);
        expect(mockSetUploadedForm).toHaveBeenCalledTimes(2);
        expect(mockSetUploadedForm.mock.calls[1][0]).toStrictEqual([{
          "N Number": "n2223333",
          "originalWorker": {
            attributes: {
              full_name: "Snowball Jones",
              emp_first_name: "Snowball",
              emp_last_name: "Jones",
              extension: "7891",
              n_number: "n2223333",
              email: "snowball.jones@libertymutual.com",
              profile_id: 2,
              manager_n_number: "n0260000"
            }
          },
          "rowNumber": 1,
          "workerSid": undefined
        }]);
      });
    });
    describe("Profile field is cleared", () => {
      test("removeTemplate is called", async () => {
        renderComponent([updateTemplates.SYNC_HR_ATTRIBUTES]);
        expect(Dropdown.mock.calls.length).toBe(1);
        expect(Dropdown.mock.calls[0][0].value).toBe("");
        const onProfileSelect = Dropdown.mock.calls[0][0].updateValue;
        const selectedProfile = initialTestState.profileContext.profiles.find(p => p.profile_id === 2);
        act(() => onProfileSelect(null, selectedProfile));
        expect(Dropdown.mock.calls.length).toBe(2);
        expect(Dropdown.mock.calls[1][0].value.profile_id).toBe(2);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(1);
        const onProfileClear = Dropdown.mock.calls[1][0].updateValue;
        act(() => onProfileClear(null, null));
        expect(mockReplaceTemplates).toHaveBeenCalledTimes(0);
        expect(mockRemoveTemplates).toHaveBeenCalledTimes(2);
      });
    });
  });
});