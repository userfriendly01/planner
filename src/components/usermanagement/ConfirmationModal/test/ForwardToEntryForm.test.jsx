import ForwardToEntryForm from "../ForwardToEntryForm";
import {
  FilterableSelect,
  ModalPhoneNumber
} from "components";
import {
  FormControlLabel,
  Radio
} from "@material-ui/core";
import React from "react";
import {
  act,
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  FilterableSelect: jest.fn(),
  ModalPhoneNumber: jest.fn()
}));

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  FormControlLabel: jest.fn(),
  Radio: jest.fn()
}));

const mockSkills = [
  {
    skill: "skill A"
  },
  {
    skill: "skill B"
  },
  {
    skill: "skill C"
  }
];

const mockSkillOptions = [
  {
    label: mockSkills[0].skill,
    value: mockSkills[0].skill
  },
  {
    label: mockSkills[1].skill,
    value: mockSkills[1].skill
  },
  {
    label: mockSkills[2].skill,
    value: mockSkills[2].skill
  }
];

const mockWorkers = [
  {
    sid: "WK123456",
    attributes: {
      full_name: "Worker A"
    }
  },
  {
    sid: "WK225874",
    attributes: {
      full_name: "Worker B"
    }
  },
  {
    sid: "WK964644",
    attributes: {
      full_name: "Worker C"
    }
  }
];

const mockWorkerOptions = [
  {
    label: mockWorkers[0].attributes.full_name,
    value: mockWorkers[0].sid
  },
  {
    label: mockWorkers[1].attributes.full_name,
    value: mockWorkers[1].sid
  },
  {
    label: mockWorkers[2].attributes.full_name,
    value: mockWorkers[2].sid
  }
];

const mockUpdateForwardTo = jest.fn();

const renderComponent = () => {
  return render(<ForwardToEntryForm
    skills={mockSkills}
    workers={mockWorkers}
    updateForwardTo={mockUpdateForwardTo}
  />);
};

describe("<ForwardToEntryForm />", () => {

  beforeEach(() => {
    setupMockedComponents({
      FilterableSelect,
      ModalPhoneNumber,
      FormControlLabel,
      Radio
    });
    jest.clearAllMocks();
  });

  test("ForwardToEntryForm initial state is as expected and shows default of worker dropdown", () => {
    const rendered = renderComponent();
    render(FormControlLabel.mock.calls[0][0].control);
    render(FormControlLabel.mock.calls[1][0].control);
    render(FormControlLabel.mock.calls[2][0].control);
    expect(rendered.container).toHaveTextContent("This user has a direct dial number. Please choose a forward to option before confirming.");
    expectMockedComponent(rendered, { FormControlLabel }, 3);
    expectMockedComponent(rendered, { Radio }, 3);
    expectMockedComponent(rendered, { FilterableSelect }, 1);
    expectMockedComponent(rendered, { ModalPhoneNumber }, 0);
    expect(FilterableSelect.mock.calls[0][0].optionsList).toStrictEqual(mockWorkerOptions);
  });
  describe("New Radio option is selected", () => {
    test("when skill radio button is selected, handleChange is called and skills dropdown is rendered", () => {
      const rendered = renderComponent();
      render(FormControlLabel.mock.calls[0][0].control);
      render(FormControlLabel.mock.calls[1][0].control);
      render(FormControlLabel.mock.calls[2][0].control);
      expect(Radio.mock.calls[0][0].checked).toBe(true);
      expect(Radio.mock.calls[1][0].checked).toBe(false);
      const handleChange = Radio.mock.calls[1][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[1][0].value
        }
      }));
      render(FormControlLabel.mock.calls[3][0].control);
      render(FormControlLabel.mock.calls[4][0].control);
      expect(Radio.mock.calls[3][0].checked).toBe(false);
      expect(Radio.mock.calls[4][0].checked).toBe(true);
      expectMockedComponent(rendered, { FilterableSelect }, 1);
      expect(FilterableSelect.mock.calls[1][0].optionsList).toStrictEqual(mockSkillOptions);
    });
    test("when number radio button is selected, handleChange is called and number field is rendered", () => {
      const rendered = renderComponent();
      render(FormControlLabel.mock.calls[0][0].control);
      render(FormControlLabel.mock.calls[1][0].control);
      render(FormControlLabel.mock.calls[2][0].control);
      expect(Radio.mock.calls[0][0].checked).toBe(true);
      expect(Radio.mock.calls[2][0].checked).toBe(false);
      const handleChange = Radio.mock.calls[2][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[2][0].value
        }
      }));
      render(FormControlLabel.mock.calls[3][0].control);
      render(FormControlLabel.mock.calls[5][0].control);
      expect(Radio.mock.calls[3][0].checked).toBe(false);
      expect(Radio.mock.calls[4][0].checked).toBe(true);
      expectMockedComponent(rendered, { FilterableSelect }, 0);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
    });
    test("when person radio button is selected, handleChange is called and worker dropdown is rendered", () => {
      const rendered = renderComponent();
      render(FormControlLabel.mock.calls[0][0].control);
      render(FormControlLabel.mock.calls[1][0].control);
      render(FormControlLabel.mock.calls[2][0].control);
      expect(Radio.mock.calls[0][0].checked).toBe(true);
      expect(Radio.mock.calls[2][0].checked).toBe(false);
      const handleChange = Radio.mock.calls[2][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[2][0].value
        }
      }));
      render(FormControlLabel.mock.calls[3][0].control);
      render(FormControlLabel.mock.calls[5][0].control);
      expect(Radio.mock.calls[3][0].checked).toBe(false);
      expect(Radio.mock.calls[4][0].checked).toBe(true);
      expectMockedComponent(rendered, { FilterableSelect }, 0);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      const revertChange = Radio.mock.calls[0][0].onChange;
      act(() => revertChange({
        target: {
          value: Radio.mock.calls[0][0].value
        }
      }));
      render(FormControlLabel.mock.calls[6][0].control);
      expect(Radio.mock.calls[5][0].checked).toBe(true);
    });
  });
  describe("Worker dropdown is displayed", () => {
    test("when a worker is selected from dropdown, updateForwardTo is called with that value", () => {
      renderComponent();
      const updateValue = FilterableSelect.mock.calls[0][0].updateValue;
      act(() => updateValue(FilterableSelect.mock.calls[0][0].optionsList[0]));
      expect(FilterableSelect.mock.calls[0][0].optionsList).toStrictEqual(mockWorkerOptions);
      expect(mockUpdateForwardTo).toHaveBeenCalledTimes(1);
      expect(mockUpdateForwardTo).toHaveBeenCalledWith(mockWorkerOptions[0].value);
    });
  });
  describe("Skill dropdown is displayed ", () => {
    test("when a skill is selected from dropdown, updateForwardTo is called with that value", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[1][0].control);
      const handleChange = Radio.mock.calls[0][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[0][0].value
        }
      }));
      const updateValue = FilterableSelect.mock.calls[1][0].updateValue;
      act(() => updateValue(FilterableSelect.mock.calls[1][0].optionsList[0]));
      expect(FilterableSelect.mock.calls[1][0].optionsList).toStrictEqual(mockSkillOptions);
      expect(mockUpdateForwardTo).toHaveBeenCalledTimes(2);
      expect(mockUpdateForwardTo).toHaveBeenCalledWith(mockSkillOptions[0].value);
    });
  });
  describe("Number Input is displayed ", () => {
    test("when a phone number is entered but is not valid, setForwardTo is not called", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[2][0].control);
      const handleChange = Radio.mock.calls[0][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[0][0].value
        }
      }));
      const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
      act(() => updateValue("(603-851-820)", "603851820", false));
      expect(mockUpdateForwardTo).toHaveBeenCalledTimes(2);
      expect(mockUpdateForwardTo).toHaveBeenCalledWith(null);
    });
    test("when a phone number is entered and is valid, setForwardTo is called", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[2][0].control);
      const handleChange = Radio.mock.calls[0][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[0][0].value
        }
      }));
      const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
      act(() => updateValue("(603-851-8200)", "6038518200", true));
      expect(mockUpdateForwardTo).toHaveBeenCalledTimes(2);
      expect(mockUpdateForwardTo).toHaveBeenCalledWith("+16038518200");
    });
    test("when onblur is called when an invalid number, showError is activated", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[2][0].control);
      const handleChange = Radio.mock.calls[0][0].onChange;
      act(() => handleChange({
        target: {
          value: Radio.mock.calls[0][0].value
        }
      }));
      const onBlur = ModalPhoneNumber.mock.calls[0][0].onBlur;
      act(() => onBlur());
      expect(ModalPhoneNumber.mock.calls[1][0].showError).toBe(true);
    });
  });
});