import React from "react";
import StyledButton from "../StyledButton";
import {
  fireEvent,
  render
} from "testUtils";

const onClick = jest.fn();
const dataTestId = "styled-button";

const renderButton = disabled => render(<StyledButton disabled={disabled} onClick={onClick} data-testid={dataTestId} />);

describe("StyledButton", () => {
  beforeEach(() => onClick.mockClear());
  describe("enabled", () => {
    const disabled = false;
    test("button click should fire onClick prop", () => {
      const button = renderButton(disabled).getByTestId(dataTestId);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
  describe("disabled", () => {
    const disabled = true;
    test("button click should not fire onClick prop", () => {
      const button = renderButton(disabled).getByTestId(dataTestId);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });
});