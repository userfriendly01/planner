import React from "react";
import SkillsTable from "../SkillsTable";
import {
  CustomTableHeader,
  CustomTableRow,
  FilterWrapper
} from "../../Skills.Styles";
import { Circle } from "@mui/icons-material";
import {
  Checkbox,
  Tooltip
} from "@mui/material";
import {
  act,
  render,
  setupMockedComponents,
  skillsList
} from "testUtils";

jest.mock("@mui/icons-material", () => ({
  Circle: jest.fn(),
  Close: jest.fn(),
  CloseRounded: jest.fn(),
  AccountBox: jest.fn(),
  Edit: jest.fn(),
  Delete: jest.fn(),
  InfoOutlined: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Checkbox: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Paper: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Tooltip: jest.fn(),
  Divider: jest.fn()
}));

jest.mock("../../Skills.Styles", () => ({
  CustomTable: jest.requireActual("../../Skills.Styles").CustomTable,
  CustomTableData: jest.requireActual("../../Skills.Styles").CustomTableData,
  CustomTableHeader: jest.fn(),
  CustomTableRow: jest.fn(),
  FilterWrapper: jest.fn(),
  TableContainer: jest.requireActual("../../Skills.Styles").TableContainer,
  TableText: jest.requireActual("../../Skills.Styles").TableText,
  TableIcon: jest.requireActual("../../Skills.Styles").TableIcon
}));

const defaultTableState = {
  filteredList: skillsList,
  selected: [],
  closedFilter: false,
  flashFilter: false
};
const mockSetTableState = jest.fn();

const renderComponent = (customSelected, customTableState) => {
  const tableState = customTableState || defaultTableState;
  const rendered = render(<SkillsTable
    tableState={{
      ...tableState,
      selected: customSelected || defaultTableState.selected
    }}
    setTableState={mockSetTableState}
  />);

  const headerCount = 5;
  for(let i = 0; i <= headerCount; i++){
    if(CustomTableHeader.mock.calls[i] && CustomTableHeader.mock.calls[i][0]){
      render(CustomTableHeader.mock.calls[i][0].children);
    }
  }

  const rowCount = tableState.filteredList.length;
  for(let i = 0; i <= rowCount; i++){
    if(CustomTableRow.mock.calls[i] && CustomTableRow.mock.calls[i][0]){
      render(CustomTableRow.mock.calls[i][0].children);
    }
  }

  Tooltip.mock.calls.map(c => {
    render(c[0].children);
  });

  return rendered;
};

describe("SkillsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Circle,
      Tooltip,
      Checkbox,
      CustomTableHeader,
      CustomTableRow,
      FilterWrapper
    });
  });
  test("THIS TEST MUST BE RUN FIRST - unknown mocking issue", () => {
    renderComponent();
    /*
      This test is needed to make the rest pass as expected

      I'm not sure why but CustomTableheader and CustomTableRow both rendered an extra
      empty array on their second array instance when the first test is run but seems to be fine for the remaining tests.

      This test is needed whether you're running a single test or the whole file. It will show
      the mock.calls.length to be one longer than its expected to be but the rest will be fine.

      CustomTableHeader.mock.calls[1][0] = [];
      CustomTableRow.mock.calls[1][0] = [];

      This is annoying so tacos to anyone that can understand why
    */
  });
  describe("initial state", () => {
    test("should render expected headers", () => {
      renderComponent();

      expect(CustomTableHeader.mock.calls.length).toBe(5);

      const checkboxClick = Checkbox.mock.calls[4][0].onClick;
      act(() => {
        checkboxClick();
      });
      expect(Checkbox.mock.calls.length).toBe(6);
      expect(Checkbox.mock.calls[0][0].checked).toBe(false);
      expect(CustomTableHeader.mock.calls[1][0].children).toBe("SKILL NAME");
      expect(CustomTableHeader.mock.calls[2][0].children).toBe("PROFILES");
      expect(FilterWrapper.mock.calls[0][0].children).toBe("FLASH");
      expect(FilterWrapper.mock.calls[0][0].active).toBe(false);
      expect(FilterWrapper.mock.calls[1][0].children).toBe("CLOSED");
      expect(FilterWrapper.mock.calls[0][0].active).toBe(false);
    });
    test("should render expected rows", () => {
      renderComponent();

      expect(CustomTableRow.mock.calls.length).toBe(5);

      expect(CustomTableRow.mock.calls[0][0].selected).toBe(false);
      expect(Checkbox.mock.calls[0][0].checked).toBe(false);
      const rowOneSecondChild = render(CustomTableRow.mock.calls[0][0].children[1]);
      expect(rowOneSecondChild.container).toHaveTextContent("lscOBDialer1");
      const rowOneThirdChild = render(CustomTableRow.mock.calls[0][0].children[2]);
      expect(rowOneThirdChild.container).toHaveTextContent("Licensed Sales Center - 32");

      expect(CustomTableRow.mock.calls[1][0].selected).toBe(false);
      expect(Checkbox.mock.calls[1][0].checked).toBe(false);
      const rowTwoSecondChild = render(CustomTableRow.mock.calls[1][0].children[1]);
      expect(rowTwoSecondChild.container).toHaveTextContent("aisgL1");
      const rowTwoThirdChild = render(CustomTableRow.mock.calls[1][0].children[2]);
      expect(rowTwoThirdChild.container).toHaveTextContent("AISG - 4");

      expect(CustomTableRow.mock.calls[2][0].selected).toBe(false);
      expect(Checkbox.mock.calls[2][0].checked).toBe(false);
      const rowThreeSecondChild = render(CustomTableRow.mock.calls[2][0].children[1]);
      expect(rowThreeSecondChild.container).toHaveTextContent("bscCommisssions");
      const rowThreeThirdChild = render(CustomTableRow.mock.calls[2][0].children[2]);
      expect(rowThreeThirdChild.container).toHaveTextContent("BSC - 10");

      expect(CustomTableRow.mock.calls[3][0].selected).toBe(false);
      expect(Checkbox.mock.calls[3][0].checked).toBe(false);
      const rowFourSecondChild = render(CustomTableRow.mock.calls[3][0].children[1]);
      expect(rowFourSecondChild.container).toHaveTextContent("bscCbsL2");
      const rowFourThirdChild = render(CustomTableRow.mock.calls[3][0].children[2]);
      expect(rowFourThirdChild.container).toHaveTextContent("BSC - 10, BLST Billing - 12");

      expect(CustomTableRow.mock.calls[4][0].selected).toBe(false);
      expect(Checkbox.mock.calls[4][0].checked).toBe(false);
      const rowFiveSecondChild = render(CustomTableRow.mock.calls[4][0].children[1]);
      expect(rowFiveSecondChild.container).toHaveTextContent("lscUSAA");
      const rowFiveThirdChild = render(CustomTableRow.mock.calls[4][0].children[2]);
      expect(rowFiveThirdChild.container).not.toHaveTextContent();

      expect(Circle.mock.calls.length).toBe(3);

    });
  });
  describe("select all checkbox is checked", () => {
    describe("selected array is empty", () => {
      test("setTableState is called with all skills", () => {
        renderComponent();
        const selectAll = Checkbox.mock.calls[0][0].onChange;
        act(() => {
          selectAll();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: defaultTableState.filteredList
        });
      });
    });
    describe("all skills are in selected array", () => {
      test("setTableState is called with empty array", () => {
        renderComponent(skillsList);
        const selectAll = Checkbox.mock.calls[0][0].onChange;
        act(() => {
          selectAll();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: []
        });
      });
    });
  });
  describe("flash filter is clicked", () => {
    test("setTableState is called with flashFilter === true", () => {
      renderComponent();
      const setFlashFilter = CustomTableHeader.mock.calls[3][0].onClick;
      act(() => {
        setFlashFilter();
      });
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...defaultTableState,
        flashFilter: true
      });
    });
  });
  describe("close filter is clicked", () => {
    test("setTableState is called with closeFilter === true", () => {
      renderComponent();
      const setClosedFilter = CustomTableHeader.mock.calls[4][0].onClick;
      act(() => {
        setClosedFilter();
      });
      expect(mockSetTableState).toHaveBeenCalledTimes(1);
      expect(mockSetTableState).toHaveBeenCalledWith({
        ...defaultTableState,
        closedFilter: true
      });
    });
  });
  describe("row is checked", () => {
    describe("skill is not in the selected array", () => {
      test("setTableState is called with row skill", () => {
        renderComponent();
        const rowThreeCheckBox = Checkbox.mock.calls[3][0].onClick;
        act(() => {
          rowThreeCheckBox();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: [skillsList[2]]
        });
      });
    });
    describe("skill is already in the selected array", () => {
      test("setTableState is called with array of existing skills minus selected skill", () => {
        renderComponent([skillsList[1]]);
        const rowTwoCheckBox = Checkbox.mock.calls[2][0].onClick;
        act(() => {
          rowTwoCheckBox();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: []
        });
      });
    });
  });
  describe("row is selected", () => {
    describe("skill is not in the selected array", () => {
      test("setTableState is called with selected skill", () => {
        renderComponent();
        const rowThree = CustomTableRow.mock.calls[2][0].onClick;
        act(() => {
          rowThree();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: [skillsList[2]]
        });
      });
    });
  });
});