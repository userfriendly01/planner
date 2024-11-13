import React from "react";
import {
  ColumnDef,
  createColumnHelper
} from "@tanstack/react-table";
import {
  TwilioConsoleRole,
  TwilioConsoleUser
} from "./interfaces";
import {
  Badge,
  Caption,
  IconAccordionCaretDown,
  IconAccordionCaretRight,
  IconButton
} from "@lmig/lmds-react";
import { PillButton } from "@lmig/lmds-react-pill-button";

const columnHelperUsers = createColumnHelper<TwilioConsoleUser>();
export const twilioConsoleUsersColumns = [
  columnHelperUsers.display({
    id: "expand",
    header: "",
    cell: ({ row }) => {
      if (!row.original.roles.length) {
        return null;
      }

      return (
        <IconButton initialSize="16" onClick={() => row.toggleExpanded()}>
          {row.getIsExpanded() ? <IconAccordionCaretDown /> : <IconAccordionCaretRight />}
        </IconButton>
      );
    }
  }),
  columnHelperUsers.accessor(row => `${row.firstName} ${row.lastName}`, {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.getValue("name")}</div>
          <Caption>
            {row.original.sid}
          </Caption>
        </div>
      );
    }
  }),
  columnHelperUsers.accessor("email", {
    id: "email",
    header: "Email"
  }),
  columnHelperUsers.accessor("twilioActive", {
    id: "twilioActive",
    header: "Twilio Status",
    cell: ({ row }) => {
      const isActive = row.getValue("twilioActive") as boolean;

      return (
        <Badge
          className="badge"
          compact
          highlightType={isActive ? "positive" : "negative"}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    }
  }),
  columnHelperUsers.accessor("hrActive", {
    id: "hrActive",
    header: "Employment Status",
    cell: ({ row }) => {
      const isActive = row.getValue("hrActive") as boolean;

      return (
        <Badge
          className="badge"
          compact
          highlightType={isActive ? "positive" : "negative"}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    }
  }),
  columnHelperUsers.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <PillButton disabled size="small" variant="primary">
        Delete
      </PillButton>
    )
  })
] as ColumnDef<TwilioConsoleUser>[];

const columnHelperRoles = createColumnHelper<TwilioConsoleRole>();
export const twilioConsoleUsersRolesColumns = [
  columnHelperRoles.accessor("accountName", {
    id: "accountName",
    header: "Account",
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.getValue("accountName")}</div>
          <Caption>
            {row.original.accountSid}
          </Caption>
        </div>
      );
    }
  }),
  columnHelperRoles.accessor("name", {
    id: "name",
    header: "Role",
    meta: {
      className: "inner-table-spacing"
    },
    cell: ({ row }) => {
      return (
        <div>
          <div>{row.getValue("name")}</div>
          <Caption>
            {row.original.sid}
          </Caption>
        </div>
      );
    }
  }),
  columnHelperRoles.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <PillButton disabled size="small" variant="primary">
        Delete
      </PillButton>
    )
  })
] as ColumnDef<TwilioConsoleRole>[];