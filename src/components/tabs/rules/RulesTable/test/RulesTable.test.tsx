import React from "react";
import { useAdminState } from "context/appContext";
import {
  render, waitFor
} from "testUtils";
import { RulesTable } from "../RulesTable";
import { LMDSTable } from "components/core/LMDSTable/LMDSTable";
import { getTwilioConsoleUsers } from "services/twilioConsoleUsers";
import {
  Notification, Pagination
} from "@lmig/lmds-react";
import { fetchUserByEmail } from "services/fetchUser";

jest.mock("services/twilioConsoleUsers", () => ({
  getTwilioConsoleUsers: jest.fn()
}));

jest.mock("services/fetchUser", () => ({
  fetchUserByEmail: jest.fn()
}));

jest.mock("@lmig/lmds-react", () => ({
  Notification: jest.fn(),
  Pagination: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn()
}));

jest.mock("components/core/LMDSTable/LMDSTable", () => ({
  LMDSTable: jest.fn()
}));

jest.mock("../columns", () => ({
  twilioConsoleUsersColumns: [],
  twilioConsoleUsersRolesColumns: []
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

describe("TwilioConsoleUsersView", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (useAdminState as jest.Mock).mockReturnValue({
      userContext: {
        tokens: {
          adminService: "adminService",
          msGraph: "msGraph"
        }
      }
    });
    (getTwilioConsoleUsers as jest.Mock).mockResolvedValue([]);
  });

  test("initial render", async () => {
    render(<RulesTable />);

    expect(LMDSTable).toHaveBeenCalled();
    expect(Pagination).toHaveBeenCalled();

    expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        isLoading: true,
        data: []
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
    (getTwilioConsoleUsers as jest.Mock).mockResolvedValue(mockUsers);
    (fetchUserByEmail as jest.Mock)
      .mockResolvedValueOnce({
        isTerminated: false
      })
      .mockResolvedValueOnce(null);


    render(<RulesTable />);

    expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        isLoading: true,
        data: []
      })
    );

    await waitFor(() => {
      expect(getTwilioConsoleUsers).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(fetchUserByEmail).toHaveBeenCalledTimes(2);
    });

    expect((LMDSTable as jest.Mock).mock.calls[2][0]).toEqual(
      expect.objectContaining({
        isLoading: false,
        data: [
          {
            ...mockUsers[0],
            hrActive: true,
            children: expect.not.objectContaining(null)
          },
          {
            ...mockUsers[1],
            hrActive: false,
            children: null
          }
        ]
      })
    );

    expect((Pagination as jest.Mock).mock.calls[2][0]).toEqual(
      expect.objectContaining({
        itemCount: 2
      })
    );

    render((LMDSTable as jest.Mock).mock.calls[2][0].data[0].children);
    expect((LMDSTable as jest.Mock).mock.calls[3][0]).toEqual(
      expect.objectContaining({
        data: mockUsers[0].roles
      })
    );
  });

  test("should set loading to false and display error when an error occurs fetching the data", async () => {
    (getTwilioConsoleUsers as jest.Mock).mockRejectedValue(new Error("Whoopsies"));

    render(<RulesTable />);

    expect((LMDSTable as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        isLoading: true,
        data: []
      })
    );

    await waitFor(() => {
      expect(getTwilioConsoleUsers).toHaveBeenCalled();
    });

    expect((LMDSTable as jest.Mock).mock.calls[2][0]).toEqual(
      expect.objectContaining({
        isLoading: false,
        data: []
      })
    );
    expect((Notification as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        alert: "Error fetching Twilio Console Users: Whoopsies"
      })
    );
  });

  test("should change pagination when onChange is called on Pagination", async () => {
    render(<RulesTable />);

    const { onChange } = (Pagination as jest.Mock).mock.calls[0][0];

    onChange({
      page: 1,
      itemsPerPage: 20
    });

    expect((Pagination as jest.Mock).mock.calls[1][0]).toEqual(
      expect.objectContaining({
        page: 1,
        itemsPerPage: 20
      })
    );
  });
});
