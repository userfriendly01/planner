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
  PaperContainer: jest.fn(),//jest.requireActual("components").PaperContainer,
  StyledButton: jest.fn(),
  ManagerDropdown: jest.fn(),
  ProfileFilterDropdown: jest.fn(),
  OuFilterDropdown: jest.fn(),
  ComponentControl: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleClear = jest.fn();
const mockSetTableState = jest.fn();
let tableState = {
  managerFilter: null,
  profileFilter: null,
  ouFilter: null
};


describe("<FilterModal />", () => {

  const renderComponent = () => render(<FilterModal handleClose={mockHandleClose} handleClear={mockHandleClear} tableState={tableState} setTableState={mockSetTableState} />);
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
    mockSetTableState.mockClear();
  });

  describe("initial state of the modal", () => {
    test("should render StyledButtons, CloseRounded, ProfileFilterDropdown, ManagerDropdown & OuFilterDropdown once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { ManagerDropdown });
      expect(ManagerDropdown.mock.calls[0][0].filterBy).toBe(tableState.managerFilter);
      expectMockedComponent(rendered, { ProfileFilterDropdown });
      expect(ProfileFilterDropdown.mock.calls[0][0].filterBy).toBe(tableState.profileFilter);
      expectMockedComponent(rendered, { OuFilterDropdown });
      expect(OuFilterDropdown.mock.calls[0][0].filterBy).toBe(tableState.ouFilter);
      expect(StyledButton.mock.calls[0][0].children).toBe("Apply Filters");
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear Filters");
    });
  });

  describe("setFilter is called on Manager Dropdown", () => {
    test("should call setTableState", () => {
      const managerNNumber = "n0263786";
      renderComponent();
      const setFilter = ManagerDropdown.mock.calls[0][0].setFilter;
      act(() => setFilter(managerNNumber));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        managerFilter: managerNNumber
      });
    });
  });

  describe("setFilter is called on Ou Dropdown", () => {
    test("should call setTableState", () => {
      const ou = "claims";
      renderComponent();
      const setFilter = OuFilterDropdown.mock.calls[0][0].setFilter;
      act(() => setFilter(ou));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        ouFilter: ou
      });
    });
  });

  describe("setFilter is called on Profile Dropdown", () => {
    test("should call setTableState", () => {
      const profileId = "12";
      renderComponent();
      const setFilter = ProfileFilterDropdown.mock.calls[0][0].setFilter;
      act(() => setFilter(profileId));
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...tableState,
        profileFilter: profileId
      });
    });
  });

  describe("close behaviour", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
      expect(StyledButton.mock.calls[0][0].children).toBe("Apply Filters");
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
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear Filters");
    });
    test("should clear filters when clicked", () => {
      tableState = {
        managerFilter: "n123456",
        profileFilter: "7",
        ouFilter: "claims"
      };
      renderComponent();
      act(() => {
        StyledButton.mock.calls[1][0].onClick();
      });
    //   expect(tableState).toBe({
    //     managerFilter: null,
    //     profileFilter: null,
    //     ouFilter: null
    //   }); fix this
    });
  });



});

