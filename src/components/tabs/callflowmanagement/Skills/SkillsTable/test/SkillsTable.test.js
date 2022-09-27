import React from "react";
import SkillsTable from "../SkillsTable";
import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  FilterWrapper,
  TableContainer,
  TableText,
  TableIcon
} from "../../Skills.Styles";
import {
  Block,
  FlashOn
} from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import {
  act,
  render,
  expectOnlyPassedProps,
  setupMockedComponents,
  skillsList
} from "testUtils";

jest.mock("@mui/icons-material", () => ({
  Block: jest.fn(),
  FlashOn: jest.fn(),
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
  Tab: jest.fn()
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

const defaultChecked = [];
const defaultTableState = {
  filteredList: skillsList,
  selected: skillsList[0],
  closedFilter: false,
  flashFilter: false
};
const mockSetChecked = jest.fn();
const mockSetTableState = jest.fn();

const renderComponent = (customChecked, customTableState) => {
  const checked = customChecked || defaultChecked;
  const tableState = customTableState || defaultTableState;
  const rendered = render(<SkillsTable
    checked={checked}
    tableState={tableState}
    setChecked={mockSetChecked}
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
  return rendered;
};

describe("SkillsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Block,
      FlashOn,
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

      expect(CustomTableRow.mock.calls[0][0].selected).toBe(true);
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

      expect(FlashOn.mock.calls.length).toBe(1);
      expect(Block.mock.calls.length).toBe(2);

    });
    describe("selected skill payload matches filtered list skill payload", () => {
      test("setTableState is called with correct skill state", () => {
        renderComponent();
        expect(mockSetTableState).toHaveBeenCalledTimes(0);
      });
    });
    describe("selected skill payload does not match filtered list skill payload", () => {
      test("setTableState is called with correct skill state", () => {
        const customTableState = {
          ...defaultTableState,
          selected: {
            ...defaultTableState.selected,
            flashMessage: "I'm a stale message"
          }
        };
        renderComponent(null, customTableState);
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith(defaultTableState);
      });
    });
    describe("selected skill is no longer in the filtered list", () => {
      test("setTableState is called with the first option in the filtered list", () => {
        const customTableState = {
          ...defaultTableState,
          selected: {
            name: "Unknown Skill"
          }
        };
        renderComponent(null, customTableState);
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: defaultTableState.filteredList[0]
        });
      });
    });
  });
  describe("select all checkbox is checked", () => {
    describe("checked array is empty", () => {
      test("setChecked is called with all skills", () => {
        renderComponent();
        const selectAll = Checkbox.mock.calls[0][0].onChange;
        act(() => {
          selectAll();
        });
        expect(mockSetChecked).toHaveBeenCalledTimes(1);
        expect(mockSetChecked).toHaveBeenCalledWith(defaultTableState.filteredList);
      });
    });
    describe("all skills are in checked array", () => {
      test("setChecked is called with empty array", () => {
        renderComponent(skillsList);
        const selectAll = Checkbox.mock.calls[0][0].onChange;
        act(() => {
          selectAll();
        });
        expect(mockSetChecked).toHaveBeenCalledTimes(1);
        expect(mockSetChecked).toHaveBeenCalledWith([]);
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
    describe("skill is not in the checked array", () => {
      test("setChecked is called with row skill", () => {
        renderComponent();
        const rowThreeCheckBox = Checkbox.mock.calls[3][0].onClick;
        act(() => {
          rowThreeCheckBox();
        });
        expect(mockSetChecked).toHaveBeenCalledTimes(1);
        expect(mockSetChecked).toHaveBeenCalledWith([skillsList[2]]);
      });
    });
    describe("skill is already in the checked array", () => {
      test("setChecked is called with array of existing skills minus checked skill", () => {
        renderComponent([skillsList[1]]);
        const rowTwoCheckBox = Checkbox.mock.calls[2][0].onClick;
        act(() => {
          rowTwoCheckBox();
        });
        expect(mockSetChecked).toHaveBeenCalledTimes(1);
        expect(mockSetChecked).toHaveBeenCalledWith([]);
      });
    });
  });
  describe("row is selected", () => {
    describe("skill is not in the checked array", () => {
      test("setTableState is called with selected skill", () => {
        renderComponent();
        const rowThree = CustomTableRow.mock.calls[2][0].onClick;
        act(() => {
          rowThree();
        });
        expect(mockSetTableState).toHaveBeenCalledTimes(1);
        expect(mockSetTableState).toHaveBeenCalledWith({
          ...defaultTableState,
          selected: skillsList[2]
        });
      });
    });
  });
});