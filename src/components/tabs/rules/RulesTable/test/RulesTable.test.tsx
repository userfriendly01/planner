import React from "react";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  initialTestState,
  render, rules, waitFor
} from "testUtils";
import { RulesTable } from "../RulesTable";
import { LMDSTable } from "components/core/LMDSTable/LMDSTable";
import { listRules } from "services/rules";
import {
  Notification, Pagination
} from "@lmig/lmds-react";

jest.mock("services/rules", () => ({
  listRules: jest.fn()
}));

jest.mock("@lmig/lmds-react", () => ({
  Notification: jest.fn(),
  Pagination: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("components/core/LMDSTable/LMDSTable", () => ({
  LMDSTable: jest.fn()
}));

jest.mock("../columns", () => ({
  rulesColumns: [],
  mappingColumns: []
}));

const mockUsers = [
  {
    sid: "USa***123",
    firstName: "Test",
    lastName: "Tester",
    twilioActive: true,
    email: "Test.Tester@libertymutual.com",
    roles: [
      {
        sid: "IXa***123",
        name: "Owner",
        accountSid: "ACa***123",
        accountName: "AH CCT PROD"
      }
    ]
  },
  {
    sid: "USb***123",
    firstName: "Jimmy",
    lastName: "Shimmy",
    twilioActive: true,
    email: "Jimmy.Shimmy@libertymutual.com",
    roles: []
  }
];

describe("RulesTable", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    (useAdminState as jest.Mock).mockReturnValue(initialTestState);
    (listRules as jest.Mock).mockResolvedValue([]);
  });

  describe("initial render", () => {
    test("should initiate loading and render empty table", async () => {
      render(<RulesTable />);

      expect(LMDSTable).toHaveBeenCalled();
      expect(Pagination).toHaveBeenCalled();

      expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          isLoading: true,
          data: [],
          tableName: "Rules"
        })
      );
      expect((Pagination as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          itemCount: 1,
          page: 0,
          itemsPerPage: 10
        })
      );
    });
    test("should call LMDSTable with data and isLoading false when it's done loading the data", async () => {
      (listRules as jest.Mock).mockResolvedValue(rules);

      render(<RulesTable />);
      expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          isLoading: true,
          data: [],
          tableName: "Rules"
        })
      );

      await waitFor(() => {
        expect(listRules).toHaveBeenCalled();
      });

      expect((LMDSTable as jest.Mock).mock.calls[1][0]).toEqual(
        expect.objectContaining({
          isLoading: false,
          data: [expect.objectContaining({
            applications: [],
            children: expect.not.objectContaining(null),
            ...rules[0]
          }), expect.objectContaining({
            applications: ["Triton Admin"],
            children: expect.not.objectContaining(null),
            ...rules[1]
          })]
        })
      );

      expect((Pagination as jest.Mock).mock.calls[1][0]).toEqual(
        expect.objectContaining({
          itemCount: 2
        })
      );

      (LMDSTable as jest.Mock).mock.calls[1][0].data.forEach((d: { children: any }) => { render(d.children); });
      expect((LMDSTable as jest.Mock).mock.calls.length).toBe(4);

      expect((LMDSTable as jest.Mock).mock.calls[2][0]).toEqual(
        expect.objectContaining({
          data: rules[0].mappings
        })
      );

      expect((LMDSTable as jest.Mock).mock.calls[3][0]).toEqual(
        expect.objectContaining({
          data: rules[1].mappings
        })
      );
    });
  });

  describe("pagination", () => {
    test("should change pagination when onChange is called on Pagination", async () => {
      render(<RulesTable />);

      const { onChange } = (Pagination as jest.Mock).mock.calls[0][0];

      onChange({
        page: 1,
        itemsPerPage: 20
      });

      expect((Pagination as jest.Mock).mock.calls[2][0]).toEqual(
        expect.objectContaining({
          page: 1,
          itemsPerPage: 20
        })
      );
    });
  });

  describe("error thrown loading page", () => {
    beforeEach(() => {
      (useAdminState as jest.Mock).mockReturnValue({
        ...initialTestState,
        rulesContext: {
          rules: [],
          applications: [],
          ruleRelationships: []
        }
      });
      (listRules as jest.Mock).mockRejectedValue(new Error("Whoopsies"));
    });

    test("should set loading to false and display error when an error occurs fetching the data", async () => {
      render(<RulesTable />);

      expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          isLoading: true,
          data: []
        })
      );

      await waitFor(() => {
        expect(listRules).toHaveBeenCalled();
      });

      expect((LMDSTable as jest.Mock).mock.calls[1][0]).toEqual(
        expect.objectContaining({
          isLoading: false,
          data: []
        })
      );
      expect((Notification as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          alert: "Error thrown loading rules state: Whoopsies"
        })
      );
    });
  });
});
