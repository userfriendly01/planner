import React from "react";
import {
  ColumnDef,
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
  Action,
  Logic,
  Mapping,
  RuleHandler
} from "@lmig/cct-shared-rules-sdk";
import { Rule } from "./interfaces";

const columnHelperRules = createColumnHelper<Rule>();

export const rulesColumns = [
  columnHelperRules.display({
    id: "expand",
    header: "",
    cell: ({ row }) => {
      if (!row.original.mappings.length) {
        return null;
      }

      return (
        <IconButton initialSize="16" onClick={() => row.toggleExpanded()}>
          {row.getIsExpanded() ? <IconAccordionCaretDown /> : <IconAccordionCaretRight />}
        </IconButton>
      );
    }
  }),

  columnHelperRules.accessor(row => row.id, {
    id: "id",
    header: "Name",
    meta: {
      className: "name-column"
    }
  }),

  columnHelperRules.accessor(row => row.pk, {
    id: "pk",
    header: "Rule Classification",
    meta: {
      className: "type-column"
    },
    cell: ({ row }) => {
      const pk = row.getValue("pk") as string;
      const type = pk.split("#")[1];
      return (<div>{type} Rule </div>);
    }
  }),

  columnHelperRules.accessor(row => row.description, {
    id: "description",
    header: "Description",
    meta: {
      className: "description-column"
    }
  }),

  columnHelperRules.accessor("applications", {
    id: "applications",
    header: "Consumers",
    cell: ({ row }) => {
      return (row.getValue("applications") as string[]).map((app, i) => (
        <div key={i}>
          {app}
        </div>
      ));
    }
  }),

  columnHelperRules.display({
    id: "actions",
    header: "Actions",
    meta: {
      className: "button-spacing"
    },
    cell: () => (
      <>
        <IconButton disabled>
          <IconEdit size="16"/>
        </IconButton>
        <IconButton disabled size={16}>
          <IconTrash size="16"/>
        </IconButton>
      </>
    )
  })
] as ColumnDef<Rule>[];


const columnHelperMappings = createColumnHelper<Mapping>();
export const mappingColumns = [
  columnHelperMappings.accessor("logic", {
    id: "logic",
    header: "Logic",
    meta: {
      className: "inner-table-spacing"
    },
    cell: ({ row }) => ((
      <div>
        {RuleHandler.getLogicString(JSON.parse(row.original.logic as string) as Logic)}
      </div>
    ))
  }),
  columnHelperMappings.accessor("actions", {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (row.getValue("actions") as Action[]).map((action, i) => (
        <div key={i}>
          {action.key} : {action.value?.toString()}
        </div>
      ));
    }
  })
] as ColumnDef<Mapping>[];
