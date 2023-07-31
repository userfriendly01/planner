import React from "react";
import {
  fireEvent,
  render,
  within
} from "testUtils";
import { MultiFieldContainerModalView } from "../MultiFieldContainerModalView";

const mockOnClose = jest.fn();
const handleOnSet = jest.fn();

const formFields = [
  {
    label: "Teams",
    name: "teams",
    type: "multiValueText",
    vale: "",
    helperText: "Please use Enter to add team"
  },
  {
    label: "Time",
    name: "time",
    type: "number",
    helperText: "min: 1,  max: 100"
  },
  {
    label: "Caller State",
    name: "callerState",
    type: "select",
    helperText: "Caller's State or Overflow (OF)"
  }
];
const renderComponent = formFields => {
  return render(
    <MultiFieldContainerModalView
      formFields={formFields}
      indexOf={0}
      isOpen={true}
      formLabel={"Test Form"}
      onClose={mockOnClose}
      handleOnSet={handleOnSet}
    />
  );
};

describe("<MultiFieldContainerModalView />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Simulate handleClick on Save field", () => {
    const rendered = renderComponent(formFields);
    fireEvent.click(rendered.getByText("Confirm"));
    expect(handleOnSet).toBeCalled();
    expect(mockOnClose).not.toBeCalled();
  });
  test("Simulate handleClick on Cancel field", () => {
    const rendered = renderComponent(formFields);
    fireEvent.click(rendered.getByText("Cancel"));
    expect(handleOnSet).not.toBeCalled();
    expect(mockOnClose).toBeCalled();
  });
  test("Simulate data change and Save", () => {
    const rendered = renderComponent(formFields);
    fireEvent.change(rendered.getByLabelText("Time"), { target: { value: 99 }});

    const autocomplete = rendered.getByTestId("autocallerState");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "a" }});
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });


    fireEvent.click(rendered.getByText("Confirm"));
    expect(handleOnSet.mock.calls[0][0].time).toBe(99);
    expect(handleOnSet.mock.calls[0][0].callerState).toBe("State");
    expect(mockOnClose).not.toBeCalled();
  });
});