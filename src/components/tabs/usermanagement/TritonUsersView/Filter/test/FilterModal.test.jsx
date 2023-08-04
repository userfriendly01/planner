import FilterModal from "../FilterModal";
import React from "react";
import {
  expectMockedComponent,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  act
} from "testUtils";
import {
  StyledButton,
  ManagerDropdown,
  ProfileFilterDropdown,
  OuFilterDropdown,
  PaperContainer
} from "components";
import { CloseRounded } from "@mui/icons-material";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  CloseRounded: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  PaperContainer: jest.fn(),
  StyledButton: jest.fn(),
  ManagerDropdown: jest.fn(),
  ProfileFilterDropdown: jest.fn(),
  OuFilterDropdown: jest.fn(),
  ComponentControl: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleClear = jest.fn();

describe("<FilterModal />", () => {

  const renderComponent = () => render(<FilterModal handleClose={mockHandleClose} handleClear={mockHandleClear} />);
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      CloseRounded,
      StyledButton,
      ProfileFilterDropdown,
      ManagerDropdown,
      OuFilterDropdown
    });
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
    mockHandleClear.mockClear();
  });

  describe("initial state of the modal", () => {
    test("should render StyledButtons, CloseRounded, ProfileFilterDropdown, ManagerDropdown & OuFilterDropdown once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { ManagerDropdown });
      expect(ManagerDropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { ProfileFilterDropdown });
      expect(ProfileFilterDropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { OuFilterDropdown });
      expect(OuFilterDropdown.mock.calls.length).toBe(1);
      expect(StyledButton.mock.calls[0][0].children).toBe("Done");
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear");
    });
  });

  describe("close behaviour", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
      expect(StyledButton.mock.calls[0][0].children).toBe("Done");
    });
    describe("when clicked", () => {
      test("close rounded button should close the modal", () => {
        renderComponent();
        const { onClick } = getMockedComponentProps(CloseRounded);
        act(() => onClick());
        expect(mockHandleClose).toBeCalled();
      });
      test("apply filters button should close the modal", () => {
        renderComponent();
        act(() => {
          StyledButton.mock.calls[0][0].onClick();
        });
        expect(mockHandleClose).toBeCalled();
      });
    });
  });

  describe("clear filter behaviour", () => {
    test("should render whenever modal is open", () => {
      renderComponent();
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear");
    });
    test("should clear filters when clicked", () => {
      renderComponent();
      act(() => {
        StyledButton.mock.calls[1][0].onClick();
      });
      expect(mockHandleClear).toHaveBeenCalledTimes(1);
    });
  });



});

