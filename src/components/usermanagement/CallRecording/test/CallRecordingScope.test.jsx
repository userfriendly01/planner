import React from "react";
import { Checkbox } from "@material-ui/core";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

describe("<CallRecordingScope", () => {
  describe("initial render", () => {
    describe("groups.length === 0 && selectedGroup is null", () => {
      test("'Failed to load Calabrio Organization' should be displayed", () => {

      });
    });
    describe("groups.length > 0", () => {
      test("setSelectedGroup was called", () => {

      });
    });
    describe("worker is not null", () => {
      test("checkIfPartial is run", () => {

      });
    });
    test("component renders as expected", () => {

    });
  });
  describe("checkIfParial", () => {
    describe("children teams do not exist", () => {
      test("partial should be false for the group", () => {

      });
    });
    describe("no children teams are checked && the group is not checked", () => {
      test("partial should be false for the group", () => {

      });
    });
    describe("no children teams are checked and the group is checked", () => {
      test("partial should be true for the group", () => {

      });
    });
    describe("there are child teams checked && the group is not checked", () => {
      test("partial should be true for the group", () => {

      });
    });
    describe("all the children teams are checked and the group is checked", () => {
      test("partial should be false for the group", () => {

      });
    });
    describe("only some of the children teams are checked and the group is checked", () => {
      test("partial should be true for the group", () => {

      });
    });
    describe("all the children teams are checked and the group is not checked", () => {
      test("partial should be true for the group", () => {

      });
    });
    describe("group is already false when logic indicates it should be false", () => {
      test("Should not call to update the form", () => {

      });
    });
    describe("group is already true when logic indicates it should be true", () => {
      test("Should not call to update the form", () => {

      });
    });
  });
  describe("admin check box", () => {
    describe("admin box is checked", () => {
      test("all groups and teams are marked as checked", () => {

      });
    });
    describe("admin box is unchecked", () => {
      test("all groups and teams are marked as unchecked", () => {

      });
    });
    describe("only some teams/groups are checked", () => {
      test("checkIfAdmin should return false", () => {

      });
    });
  });
  describe("group is selected", () => {
    test("setSelectedGroup is run", () => {

    });
  });
  describe("group is checked", () => {
    test("handleCheckGroup is run", () => {

    });
  });
  describe("team is checked", () => {
    test("handleCheckTeam is run", () => {

    });
  });
});