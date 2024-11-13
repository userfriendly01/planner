import { render } from "testUtils";
import React from "react";
import {
  ColumnDef,
  createColumnHelper,
  Row
} from "@tanstack/react-table";
import {
  TwilioConsoleRole,
  TwilioConsoleUser
} from "../interfaces";
import { PillButton } from "@lmig/lmds-react-pill-button";
import {
  Badge,
  Caption,
  IconAccordionCaretDown,
  IconAccordionCaretRight,
  IconButton
} from "@lmig/lmds-react";

jest.mock("@lmig/lmds-react", () => ({
  Badge: jest.fn(),
  Caption: jest.fn(),
  IconAccordionCaretDown: jest.fn(),
  IconAccordionCaretRight: jest.fn(),
  IconButton: jest.fn()
}));

jest.mock("@lmig/lmds-react-pill-button", () => ({
  PillButton: jest.fn()
}));

jest.mock("@tanstack/react-table", () => ({
  createColumnHelper: jest.fn()
}));


describe("TwilioConsoleUsersView columns", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("twilioConsoleUsersColumns", () => {
    let columns: ColumnDef<TwilioConsoleUser>[];
    let accessorFunc: jest.Mock;
    let displayFunc: jest.Mock;

    beforeEach(() => {
      accessorFunc = jest.fn();
      displayFunc = jest.fn();
      (createColumnHelper as jest.Mock).mockReturnValueOnce({
        accessor: accessorFunc,
        display: displayFunc
      });

      // For the other columns that are not tested here
      (createColumnHelper as jest.Mock).mockReturnValueOnce({
        accessor: jest.fn(),
        display: jest.fn()
      });

      jest.isolateModules(() => {
        ({ twilioConsoleUsersColumns: columns } = require("../columns"));
      });
    });

    it("should return proper columns for users", () => {
      expect(columns).toHaveLength(6);
      expect(accessorFunc).toHaveBeenCalledTimes(4);
      expect(displayFunc).toHaveBeenCalledTimes(2);

      const nameRowFunc = accessorFunc.mock.calls[0][0];

      const fakeRow = {
        firstName: "Jerry",
        lastName: "Smith",
        getValue: jest.fn(),
        original: {
          sid: "fakeSid"
        }
      };

      expect(nameRowFunc(fakeRow)).toBe("Jerry Smith");

      const { cell: NameCell } = accessorFunc.mock.calls[0][1];
      const { cell: ActionCell } = displayFunc.mock.calls[1][0];

      render(<NameCell row={fakeRow} />);
      render(<ActionCell />);

      expect(fakeRow.getValue).toHaveBeenCalledTimes(1);
      expect(fakeRow.getValue).toHaveBeenCalledWith("name");
      expect(Caption).toHaveBeenCalledTimes(1);
      expect(Caption).toHaveBeenCalledWith({ children: "fakeSid" }, {});
      expect(PillButton).toHaveBeenCalledTimes(1);
    });

    describe("expand cell", () => {
      it("should return null if user has no roles", () => {
        const fakeRow = {
          original: {
            roles: [] as TwilioConsoleRole[]
          },
          toggleExpanded: jest.fn(),
          getIsExpanded: jest.fn()
        };

        const { cell: ExpandCell } = displayFunc.mock.calls[0][0];

        const { container } = render(<ExpandCell row={fakeRow} />);
        expect(container).toBeEmptyDOMElement();
      });

      it("should return IconButton with CaretRight when there are roles and row is not expanded ", () => {
        const fakeRow = {
          original: {
            roles: [{}] as TwilioConsoleRole[]
          },
          toggleExpanded: jest.fn(),
          getIsExpanded: jest.fn().mockReturnValue(false)
        };

        const { cell: ExpandCell } = displayFunc.mock.calls[0][0];

        render(<ExpandCell row={fakeRow} />);
        render((IconButton as jest.Mock).mock.calls[0][0].children);

        // And let's click on the IconButton hehe
        (IconButton as jest.Mock).mock.calls[0][0].onClick();

        expect(IconButton).toHaveBeenCalledTimes(1);
        expect(fakeRow.toggleExpanded).toHaveBeenCalledTimes(1);
        expect(IconAccordionCaretRight).toHaveBeenCalledTimes(1);
      });

      it("should return IconButton with CaretDown when there are roles and row is expanded ", () => {
        const fakeRow = {
          original: {
            roles: [{}] as TwilioConsoleRole[]
          },
          toggleExpanded: jest.fn(),
          getIsExpanded: jest.fn().mockReturnValue(true)
        };

        const { cell: ExpandCell } = displayFunc.mock.calls[0][0];

        render(<ExpandCell row={fakeRow} />);
        render((IconButton as jest.Mock).mock.calls[0][0].children);

        expect(IconButton).toHaveBeenCalledTimes(1);
        expect(IconAccordionCaretDown).toHaveBeenCalledTimes(1);
      });
    });

    describe("twilioActive cell", () => {
      it("should have a Badge with positive highlight when getValue returns true", () => {
        const fakeRow = {
          getValue: jest.fn().mockReturnValue(true)
        };

        const { cell: TwilioActiveCell } = accessorFunc.mock.calls[2][1];

        render(<TwilioActiveCell row={fakeRow} />);

        expect(fakeRow.getValue).toHaveBeenCalledTimes(1);
        expect(fakeRow.getValue).toHaveBeenCalledWith("twilioActive");
        expect(Badge).toHaveBeenCalledTimes(1);
        expect(Badge).toHaveBeenCalledWith(
          expect.objectContaining({
            children: "Active",
            highlightType: "positive"
          }),
          {}
        );
      });

      it("should have a Badge with negative highlight when getValue returns false", () => {
        const fakeRow = {
          getValue: jest.fn().mockReturnValue(false)
        };

        const { cell: TwilioActiveCell } = accessorFunc.mock.calls[2][1];

        render(<TwilioActiveCell row={fakeRow} />);

        expect(fakeRow.getValue).toHaveBeenCalledTimes(1);
        expect(fakeRow.getValue).toHaveBeenCalledWith("twilioActive");
        expect(Badge).toHaveBeenCalledTimes(1);
        expect(Badge).toHaveBeenCalledWith(
          expect.objectContaining({
            children: "Inactive",
            highlightType: "negative"
          }),
          {}
        );
      });
    });

    describe("hrActive cell", () => {
      it("should have a Badge with positive highlight when getValue returns true", () => {
        const fakeRow = {
          getValue: jest.fn().mockReturnValue(true)
        };

        const { cell: HrActiveCell } = accessorFunc.mock.calls[3][1];

        render(<HrActiveCell row={fakeRow} />);

        expect(fakeRow.getValue).toHaveBeenCalledTimes(1);
        expect(fakeRow.getValue).toHaveBeenCalledWith("hrActive");
        expect(Badge).toHaveBeenCalledTimes(1);
        expect(Badge).toHaveBeenCalledWith(
          expect.objectContaining({
            children: "Active",
            highlightType: "positive"
          }),
          {}
        );
      });

      it("should have a Badge with negative highlight when getValue returns false", () => {
        const fakeRow = {
          getValue: jest.fn().mockReturnValue(false)
        };

        const { cell: TwilioActiveCell } = accessorFunc.mock.calls[3][1];

        render(<TwilioActiveCell row={fakeRow} />);

        expect(fakeRow.getValue).toHaveBeenCalledTimes(1);
        expect(fakeRow.getValue).toHaveBeenCalledWith("hrActive");
        expect(Badge).toHaveBeenCalledTimes(1);
        expect(Badge).toHaveBeenCalledWith(
          expect.objectContaining({
            children: "Inactive",
            highlightType: "negative"
          }),
          {}
        );
      });
    });
  });

  describe("twilioConsoleUsersRolesColumns", () => {
    let columns: ColumnDef<TwilioConsoleRole>[];
    let accessorFunc: jest.Mock;
    let displayFunc: jest.Mock;
    let fakeRow: Row<TwilioConsoleRole>;

    beforeEach(() => {
      fakeRow = {
        original: {
          sid: "fakeSid",
          accountSid: "fakeAccountSid"
        },
        getValue: jest.fn().mockReturnValue("fakeValue")
      } as unknown as Row<TwilioConsoleRole>;

      // For the other columns that are not tested here
      (createColumnHelper as jest.Mock).mockReturnValueOnce({
        accessor: jest.fn(),
        display: jest.fn()
      });

      accessorFunc = jest.fn();
      displayFunc = jest.fn();
      (createColumnHelper as jest.Mock).mockReturnValueOnce({
        accessor: accessorFunc,
        display: displayFunc
      });

      jest.isolateModules(() => {
        ({ twilioConsoleUsersRolesColumns: columns } = require("../columns"));
      });
    });

    it("should return proper columns for roles", () => {
      expect(columns).toHaveLength(3);
      expect(accessorFunc).toHaveBeenCalledTimes(2);
      expect(displayFunc).toHaveBeenCalledTimes(1);

      const { cell: AccountCell } = accessorFunc.mock.calls[0][1];
      const { cell: NameCell } = accessorFunc.mock.calls[1][1];
      const { cell: ActionCell } = displayFunc.mock.calls[0][0];

      render(<AccountCell row={fakeRow} />);
      render(<NameCell row={fakeRow} />);
      render(<ActionCell />);

      expect(fakeRow.getValue).toHaveBeenCalledTimes(2);
      expect(fakeRow.getValue).toHaveBeenNthCalledWith(1, "accountName");
      expect(fakeRow.getValue).toHaveBeenNthCalledWith(2, "name");
      expect(Caption).toHaveBeenCalledTimes(2);
      expect(Caption).toHaveBeenNthCalledWith(1, { children: "fakeAccountSid" }, {});
      expect(Caption).toHaveBeenNthCalledWith(2, { children: "fakeSid" }, {});
      expect(PillButton).toHaveBeenCalledTimes(1);
    });
  });
});