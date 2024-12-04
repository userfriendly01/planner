import {
  createColumnHelper
} from "@tanstack/react-table";
import {
  IconAccordionCaretDown,
  IconAccordionCaretRight,
  IconButton,
  IconEdit,
  IconTrash
} from "@lmig/lmds-react";
import {
  RuleHandler
} from "@lmig/cct-shared-rules-sdk";
import {
  render, setupMockedComponents
} from "testUtils";

jest.mock("@tanstack/react-table", () => ({
  ColumnDef: jest.requireActual("@tanstack/react-table").ColumnDef,
  createColumnHelper: jest.fn()
}));

jest.mock("@lmig/lmds-react", () => ({
  IconAccordionCaretDown: jest.fn(),
  IconAccordionCaretRight: jest.fn(),
  IconButton: jest.fn(),
  IconEdit: jest.fn(),
  IconTrash: jest.fn()
}));

jest.mock("@lmig/cct-shared-rules-sdk", () => ({
  Action: jest.fn(),
  Logic: jest.fn(),
  Mapping: jest.fn(),
  RuleHandler: {
    getLogicString: jest.fn()
  },
  Rule: jest.fn()
}));

const mockRulesDisplay = jest.fn();
const mockRulesAccessor = jest.fn();
const mockMappingsDisplay = jest.fn();
const mockMappingsAccessor = jest.fn();
const getValue = jest.fn();
const ruleRow = "Yay!";
const mappingRow = "Yay!";

describe("columns", () => {
  let rulesColumns;
  let mappingColumns;
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      IconButton,
      IconEdit,
      IconTrash
    });
    (createColumnHelper as jest.Mock).mockReturnValueOnce({
      display: mockRulesDisplay,
      accessor: mockRulesAccessor
    });
    (createColumnHelper as jest.Mock).mockReturnValueOnce({
      display: mockMappingsDisplay,
      accessor: mockMappingsAccessor
    });
    jest.isolateModules(() => {
      ({
        rulesColumns,
        mappingColumns
      } = require("../columns"));
    });
    mockRulesDisplay.mockReturnValue(ruleRow);
    mockRulesAccessor.mockReturnValue(ruleRow);
    mockMappingsDisplay.mockReturnValue(mappingRow);
    mockMappingsAccessor.mockReturnValue(mappingRow);
  });
  describe("rules columns", () => {
    const getIsExpanded = jest.fn();
    const toggleExpanded = jest.fn();
    const row = {
      getValue: getValue,
      getIsExpanded,
      toggleExpanded,
      original: {
        applications: ["Triton Admin"],
        description: "hello I'm a rule!",
        mappings: ["yes!"],
        pk: "hotdogs",
        id: "boopado"
      }
    };
    test("columns are generated", () => {
      expect(rulesColumns.length).toBe(6);
      expect(createColumnHelper).toHaveBeenCalledTimes(2);
      expect(mockRulesDisplay).toHaveBeenCalledTimes(2);
      expect(mockRulesAccessor).toHaveBeenCalledTimes(4);
    });
    describe("expand display", () => {
      test("expand display is called as expected", () => {
        getIsExpanded.mockReturnValue(true);
        const expandCell = mockRulesDisplay.mock.calls[0][0].cell;
        render(expandCell({ row }));
        expect(IconButton).toHaveBeenCalledTimes(1);
        render((IconButton as jest.Mock).mock.calls[0][0].children);
        expect(IconAccordionCaretDown).toHaveBeenCalledTimes(1);
        expect(IconAccordionCaretRight).toHaveBeenCalledTimes(0);
      });
      test("getIsExpanded is false", () => {
        getIsExpanded.mockReturnValue(false);
        const expandCell = mockRulesDisplay.mock.calls[0][0].cell;
        render(expandCell({ row }));
        expect(IconButton).toHaveBeenCalledTimes(1);
        render((IconButton as jest.Mock).mock.calls[0][0].children);
        expect(IconAccordionCaretDown).toHaveBeenCalledTimes(0);
        expect(IconAccordionCaretRight).toHaveBeenCalledTimes(1);
      });
      test("onClick is called", () => {
        getIsExpanded.mockReturnValue(false);
        const expandCell = mockRulesDisplay.mock.calls[0][0].cell;
        render(expandCell({ row }));
        expect(IconButton).toHaveBeenCalledTimes(1);
        render((IconButton as jest.Mock).mock.calls[0][0].children);
        const onClick = (IconButton as jest.Mock).mock.calls[0][0].onClick;
        onClick();
        expect(row.toggleExpanded).toHaveBeenCalledTimes(1);
      });
      test("mappings.length === 0", () => {
        const expandCell = mockRulesDisplay.mock.calls[0][0].cell;
        render(expandCell({ row: { original: { mappings: []}}}));
        expect(IconButton).toHaveBeenCalledTimes(0);
      });
    });
    test("id is called as expected", () => {
      expect(mockRulesAccessor.mock.calls[0][1].id).toBe("id");
    });
    test("pk is called as expected", () => {
      getValue.mockReturnValue("Rule#Business#1241243");
      expect(mockRulesAccessor.mock.calls[1][1].id).toBe("pk");
      const pkCell = mockRulesAccessor.mock.calls[1][1].cell;
      const rendered = render(pkCell({ row }));
      expect(row.getValue).toHaveBeenCalledWith("pk");
      expect(rendered.container).toHaveTextContent("Business Rule");
    });
    test("description is called as expected", () => {
      expect(mockRulesAccessor.mock.calls[2][1].id).toBe("description");
    });
    test("applications is called as expected", () => {
      getValue.mockReturnValue(row.original.applications);
      expect(mockRulesAccessor.mock.calls[3][0]).toBe("applications");
      const applicationsCell = mockRulesAccessor.mock.calls[3][1].cell;
      const rendered = render(applicationsCell({ row }));
      expect(row.getValue).toHaveBeenCalledWith("applications");
      expect(rendered.container).toHaveTextContent("Triton Admin");
    });
    test("actions display is called as expected", () => {
      const actionButtonCell = mockRulesDisplay.mock.calls[1][0].cell;
      render(actionButtonCell());
      expect(IconButton).toHaveBeenCalledTimes(2);
      (IconButton as jest.Mock).mock.calls.forEach(call => {
        render(call[0].children);
      });
      expect(IconEdit).toHaveBeenCalledTimes(1);
      expect(IconTrash).toHaveBeenCalledTimes(1);
    });
  });
  describe("mappings columns", () => {
    const row = {
      getValue: getValue,
      original: {
        logic: JSON.stringify({ and: "Here lies the secret sauce" }),
        actions: [JSON.stringify({
          key: "attribute",
          value: "do me!"
        })]
      }
    };
    test("columns are generated", () => {
      expect(mappingColumns.length).toBe(2);
      expect(createColumnHelper).toHaveBeenCalledTimes(2);
      expect(mockMappingsDisplay).toHaveBeenCalledTimes(0);
      expect(mockMappingsAccessor).toHaveBeenCalledTimes(2);
    });
    test("logic accessor is called as expected", () => {
      expect(mockMappingsAccessor.mock.calls[0][0]).toBe("logic");
      const logicCell = mockMappingsAccessor.mock.calls[0][1].cell;
      logicCell({ row });
      expect(RuleHandler.getLogicString).toHaveBeenCalledTimes(1);
      expect(RuleHandler.getLogicString).toHaveBeenCalledWith({ "and": "Here lies the secret sauce" });
    });
    test("actions accessor is called as expected", () => {
      expect(mockMappingsAccessor.mock.calls[1][0]).toBe("actions");
      getValue.mockReturnValue(row.original.actions);
      const actionsCell = mockMappingsAccessor.mock.calls[1][1].cell;
      actionsCell({ row });
      expect(row.getValue).toHaveBeenCalledWith("actions");
    });
  });
});