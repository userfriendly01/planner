import ProfileColumn from "../ProfileColumn";
import React from "react";
import { Person, PersonOutline } from "@mui/icons-material";
import { theme } from "globals";
import { ThemeProvider } from "styled-components";
import { act, fireEvent, render, setupMockedComponents } from "testUtils";

jest.mock("components", () => ({
  ModalFetchingRing: jest.fn(),
  StyledButton: jest.fn(),
}));

jest.mock("@mui/icons-material", () => ({
  Close: jest.fn(),
  CloseRounded: jest.fn(),
  AccountBox: jest.fn(),
  Edit: jest.fn(),
  InfoOutlined: jest.fn(),
  Person: jest.fn(),
  PersonOutline: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Divider: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Paper: jest.requireActual("@mui/material").Paper
}));

const title = "People!!";
const people = [
  {
    ["Acd Id"]: "WK12342",
    ["Ad Login"]: "LM\\n0263786",
    ["Email"]: "faith.cuneo@libertymutual.com",
    ["First Name"]: "Faith",
    ["Last Name"]: "Cuneo",
    ["Team"]: "Default Team",
    ["User Id"]: 302,
    ["Active"]: true,
  },
  {
    ["Acd Id"]: "WK129988",
    ["Ad Login"]: "LM\\n000222",
    ["Email"]: "tom.west@libertymutual.com",
    ["First Name"]: "tom",
    ["Last Name"]: "west",
    ["Team"]: "Default Team",
    ["User Id"]: 49,
    ["Active"]: false,
  },
  {
    ["Acd Id"]: "WK124423",
    ["Ad Login"]: "LM\\n000333",
    ["Email"]: "nick.marathon@libertymutual.com",
    ["First Name"]: "nick",
    ["Last Name"]: "marathon",
    ["Team"]: "Family Guy",
    ["User Id"]: 422,
    ["Active"]: false,
  }
]
describe("ProfileColumn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Person,
      PersonOutline
    });
  });
  describe("initial render", () => {
    test("renders as expected", () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <ProfileColumn people={people} title={title} />
        </ThemeProvider>
      )
      expect(container).toHaveTextContent(people[0]["Acd Id"]);
      expect(container).toHaveTextContent("Active");
      expect(container).not.toHaveTextContent(people[1]["Acd Id"]);
      expect(container).not.toHaveTextContent(people[2]["Acd Id"]);
      expect(Person).toHaveBeenCalledTimes(1);
      expect(PersonOutline).toHaveBeenCalledTimes(2);
    });
  });
  describe("profile is selected", () => {
    test("renders as expected", () => {
      const rendered = render(
        <ThemeProvider theme={theme}>
          <ProfileColumn people={people} title={title} />
        </ThemeProvider>
      )
      expect(rendered.container).toHaveTextContent(people[0]["Acd Id"]);
      expect(rendered.container).not.toHaveTextContent(people[1]["Acd Id"]);
      const selectUser = rendered.getByTestId("user-1");
      act(() => fireEvent.click(selectUser));
      expect(rendered.container).toHaveTextContent(people[1]["Acd Id"]);
    });
  });
});