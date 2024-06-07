import { StyledButton } from "../StyledButton";
import { Button } from "@mui/material";
import React from "react";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@mui/material", () => ({
  Button: jest.fn()
}));

const mockOnClick = jest.fn();

describe("StyledButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Button
    });
  });
  describe("color is passes as prop", () => {
    const color = "red";
    test("button click should fire onClick prop", () => {
      render(<ThemeProvider theme={theme}>{<StyledButton disabled={false} color={color} onClick={mockOnClick} />}</ThemeProvider>);
      const onClick = Button.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(Button.mock.calls[0][0].disabled).toBe(false);
      expect(Button.mock.calls[0][0].color).toBe(color);
    });
  });
  describe("enabled", () => {
    test("button click should fire onClick prop", () => {
      render(<ThemeProvider theme={theme}>{<StyledButton disabled={false} onClick={mockOnClick} />}</ThemeProvider>);
      const onClick = Button.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(Button.mock.calls[0][0].disabled).toBe(false);
    });
  });
  describe("disabled", () => {
    test("button click should not fire onClick prop", () => {
      render(<ThemeProvider theme={theme}>{<StyledButton disabled={true} onClick={mockOnClick} />}</ThemeProvider>);
      const onClick = Button.mock.calls[0][0].onClick;
      act(() => {
        onClick();
      });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(Button.mock.calls[0][0].disabled).toBe(true);
    });
  });
});