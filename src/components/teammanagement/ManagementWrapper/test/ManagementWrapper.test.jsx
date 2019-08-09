import ManagementWrapper from "../ManagementWrapper";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ManagementTable } from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents,
  waitForElement
} from "testUtils";

const axiosMock = new MockAdapter(axios);

jest.mock("components", () => ({
  __esModule: true,
  ManagementTable: jest.fn()
}));

const getWorkersRespnse = [
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n1111111",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n2222222",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n3333333",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n4444444",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n5555555",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n6666666",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n7777777",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n8888888",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "n9999999",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "naaaaaaa",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  },
  {
    attributes:
      "{\"unique_id\":\"n00000000\",\"manager_n_number\":\"n1111111\",\"roles\":[\"supervisor\",\"agent\"],\"manager_last_name\":\"Doe\",\"n_number\":\"n1111111\",\"skills\":[\"466\"],\"primary_dept_name\":\"CI TECH APP SERVICES\",\"email_address\":\"Noone@libertymutual.com\",\"full_name\":\"Lemming\",\"profile_id\":1}",
    friendlyName: "nbbbbbbb",
    sid: "WK8b0da13d2eca675babceedb76d7a15eb"
  }
];

describe("<ManagementWrapper />", () => {
  beforeEach(()=> {
    setupMockedComponents({
      ManagementTable
    });
  });
  describe("when we successfully return a list of workers", () => {
    const url = apiPaths.GET_WORKERS_BY_PROFILEID(2);
    beforeEach(()=> {
      axiosMock.onGet(url).reply(200, getWorkersRespnse);
    });

    test("while loading we should show a loading icon.", () => {
      const rendered = render(<ManagementWrapper profileId={2} />);
      expectMockedComponent(rendered, { ManagementTable }, 0);
      expect(rendered.getByRole("progressbar")).toBeTruthy();
    });

    test("we should render a table, send it 10 workers, and preselect page 1.", done => {
      const rendered = render(<ManagementWrapper profileId={2} />);
      waitForElement(() =>
        rendered.getByText("ManagementTable")
      ).then(() => {
        expectMockedComponent(rendered, { ManagementTable });
        expect(ManagementTable.mock.calls[1][0].workers.length).toBe(10);
        expect(ManagementTable.mock.calls[1][0].workers[2]).toEqual({
          attributes: {
            unique_id: "n00000000",
            manager_n_number: "n1111111",
            roles: ["supervisor", "agent"],
            manager_last_name: "Doe",
            n_number: "n1111111",
            skills: ["466"],
            primary_dept_name: "CI TECH APP SERVICES",
            email_address: "Noone@libertymutual.com",
            full_name: "Lemming",
            profile_id: 1
          },
          id: "n3333333",
          sid: "WK8b0da13d2eca675babceedb76d7a15eb"
        });
        done();
      });
    });

    test("when we select page 2, we shoud only send 1 worker the 11th", done => {
      const rendered = render(<ManagementWrapper profileId={2} />);
      waitForElement(() =>
        rendered.getByText("ManagementTable")
      ).then(() => {
        expectMockedComponent(rendered, { ManagementTable });
        fireEvent.click(rendered.getByText("2", { seletor: "button" }));
        expect(ManagementTable.mock.calls[3][0].workers.length).toBe(1);
        expect(ManagementTable.mock.calls[3][0].workers[0]).toEqual({
          attributes: {
            unique_id: "n00000000",
            manager_n_number: "n1111111",
            roles: ["supervisor", "agent"],
            manager_last_name: "Doe",
            n_number: "n1111111",
            skills: ["466"],
            primary_dept_name: "CI TECH APP SERVICES",
            email_address: "Noone@libertymutual.com",
            full_name: "Lemming",
            profile_id: 1
          },
          id: "nbbbbbbb",
          sid: "WK8b0da13d2eca675babceedb76d7a15eb"
        });
        done();
      });
    });
  });
  describe("when we reject the call return a list of workers", () => {
    const url = apiPaths.GET_WORKERS_BY_PROFILEID(2);
    beforeEach(()=> {
      axiosMock.onGet(url).reply(500, { error: "HOSED!" });
    });
    test("it will hang on loading.", () => {
      const rendered = render(<ManagementWrapper profileId={2} />);
      expectMockedComponent(rendered, { ManagementTable }, 0);
      expect(rendered.getByRole("progressbar")).toBeTruthy();
    });
  });
});