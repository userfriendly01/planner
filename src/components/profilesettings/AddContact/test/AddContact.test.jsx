import AddContact from "../AddContact";
import MockAdapter from "axios-mock-adapter";
import { DialListEntryForm } from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components/profilesettings", () => ({
  __esModule: true,
  DialListEntryForm: jest.fn()
}));

const profile = {
  profileId: 42,
  dialList: []
};

describe("<AddContact />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({ DialListEntryForm });
  });

  describe("initial render", () => {
    test("should display add contact button, not modal", () => {
      const rendered = render(<AddContact profile={profile}/>);
      expect(rendered.getByTestId("add-contact-button", { selector: "button" })).toBeInTheDocument();
      expect(rendered.container).toHaveTextContent("Add Contact");
      expectMockedComponent(rendered, { DialListEntryForm }, 0);
    });
  });

  describe("button is clicked", () => {
    test("should render add/edit modal; when handleClose is called, modal should close", done => {
      const rendered = render(<AddContact profile={profile}/>);
      const addButton = rendered.getByTestId("add-contact-button", { selector: "button" });
      act(() => {
        fireEvent.click(addButton);
      });
      expectMockedComponent(rendered, { DialListEntryForm });
      const handleClose = DialListEntryForm.mock.calls[0][0].handleClose;
      act(() => handleClose());
      expectMockedComponent(rendered, { DialListEntryForm }, 0);
      done();
    });
  });

  describe("handleSubmitAddContact", () => {
    const req = {
      profile_id: profile.profileId,
      contact_nme: "Whatever - Some Contact Name",
      contact_num: "1234567",
      external_num: "(800) 555-4321"
    };
    describe("put request to contactmanager succeeds", () => {
      beforeEach(() => axiosMock.onPut(apiPaths.DIAL_LIST)).reply(200, "hooray!");
      test("should render ModalOverlay", () => {
        // TODO: test success overlay
      });
    });
    describe("put request to contactmanager fails", () => {
      beforeEach(() => axiosMock.onPut(apiPaths.DIAL_LIST)).reply(500, "oh no!");
      test("should render ModalOverlay", () => {
      // TODO: test fail overlay
      });
    });
  });
});
