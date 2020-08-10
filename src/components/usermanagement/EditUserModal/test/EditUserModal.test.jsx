import EditUserModal from "../EditUserModal";
import { CloseRounded } from "@material-ui/icons";
import MockAdapter from "axios-mock-adapter";
import {
  OutlinedSelect,
  DefaultSkillSelector,
  ModalExtension,
  StatusOverlay,
  PaperContainer,
  StyledButton
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getMockedComponentProps,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";
import {
  myAxios,
  mapWorkerFromTwilioWorker
} from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.useFakeTimers();

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  CloseRounded: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  StyledButton: jest.fn(),
  OutlinedSelect: jest.fn(),
  DefaultSkillSelector: jest.fn(),
  ModalExtension: jest.fn(),
  StatusOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const workerSid = "WK023315648120514";

const getWorker = defaultSkills => ({
  sid: workerSid,
  attributes: {
    default_skills: defaultSkills,
    extension: "1234",
    full_name: "Faith Cuneo",
    manager_n_number: "n0999887",
    n_number: "n0263786"
  }
});

const mockManagers = [
  {
    manager_first_name: "Ben",
    manager_last_name: "Wyatt",
    manager_n_number: "n1234567"
  },
  {
    manager_first_name: "Leslie",
    manager_last_name: "Knope",
    manager_n_number: "n7454853"
  }
];

const mockHandleClose = jest.fn();

const initialTestState = {
  ...initialState,
  managerContext: {
    managers: mockManagers
  }
};

const renderComponent = defaultSkills => {
  return render(<EditUserModal handleClose={mockHandleClose} worker={getWorker(defaultSkills)} />, initialTestState);
};

describe("<EditUserModal />", () => {
  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      CloseRounded,
      StyledButton,
      OutlinedSelect,
      DefaultSkillSelector,
      ModalExtension,
      StatusOverlay
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("EditUserModal is in its initial state", () => {
    describe("workers does not contain default_skills", () => {
      test("should pass default object to DefaultSkillSelector", () => {
        const defaultSkills = undefined;
        renderComponent(defaultSkills);
        expectOnlyPassedProps(DefaultSkillSelector, {
          defaultSkills: {
            skills: [],
            levels: {}
          }
        });
      });
    });
    describe("worker contains malformed default_skills", () => {
      test("should pass valid default skills object to DefaultSkillSelector", () => {
        const defaultSkills = {
          skills: ["psu-l1", "psu-l2", "466"],
          levels: "noooo"
        };
        renderComponent(defaultSkills);
        expectOnlyPassedProps(DefaultSkillSelector, {
          defaultSkills: {
            skills: ["psu-l1", "psu-l2", "466"],
            levels: {}
          }
        });
      });
    });
    describe("worker context contains valid default_skills", () => {
      test("should pass valid default skills object to DefaultSkillSelector", () => {
        const defaultSkills = {
          skills: ["psu-l1", "psu-l2", "466"],
          levels: {
            "psu-l1": 1,
            "466": 3
          }
        };
        renderComponent(defaultSkills);
        expectOnlyPassedProps(DefaultSkillSelector, {
          defaultSkills
        });
      });
    });
    test("EditUserModal Renders the appropriate elements", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("Update User");
      expectMockedComponent(rendered, { CloseRounded }, 1);
      expectMockedComponent(rendered, { OutlinedSelect }, 1);
      expectMockedComponent(rendered, { DefaultSkillSelector }, 1);
      expectMockedComponent(rendered, { StyledButton }, 1);
      expectMockedComponent(rendered, { ModalExtension }, 1);
      expectMockedComponent(rendered, { StatusOverlay }, 0);
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: true
      }, 0);
    });
  });

  describe("EditUserModal Manager List in its initial state", () => {
    test("EditUserModal shows the correct manager list is in its initial state", () => {
      renderComponent();
      const expectedManagerProps = {
        label: "Manager",
        optionsList: mockManagers
      };
      expectOnlyPassedProps(OutlinedSelect, expectedManagerProps, 0);
      const optionsDisplayFunc = OutlinedSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(mockManagers[0]);
      expect(option).toEqual({
        display: `${mockManagers[0].manager_first_name} ${mockManagers[0].manager_last_name}`,
        key: mockManagers[0].manager_n_number,
        value: JSON.stringify(mockManagers[0])
      });
    });
  });

  describe("ModalExtension in its initial state", () => {
    test("ModalExtension shows the correct extension list is in its initial state", () => {
      renderComponent();
      const expectedExtensionProps = {
        extension: "1234"
      };
      expectOnlyPassedProps(ModalExtension, expectedExtensionProps, 0);
    });
  });

  describe("update Button", () => {
    test("initial state should be disabled", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { StyledButton }, 1);
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: true
      }, 0);
    });
  });

  describe("close button", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
    });
    describe("when clicked", () => {
      test("should close the modal", () => {
        renderComponent();
        const { onClick } = getMockedComponentProps(CloseRounded);
        act(() => onClick());
        expect(mockHandleClose).toBeCalled();
      });
    });
  });

  describe("update button", () => {
    test("should be disabled by default", () => {

    });
    test("when default skills is updated, should be enabled", () => {

    });
    test("when manager is updated, should be enabled", () => {

    });
  });

  describe("service call to update worker attributes succeeds", () => {
    const mockSuccessfulResponse = {
      sid: workerSid,
      friendlyName: "Test Worker",
      attributes: "{\"skill\":\"466\"}"
    };
    const updatedManager = mockManagers[0];
    const updatedDefaultSkills = {
      skills: ["wow"],
      levels: {}
    };
    beforeEach(() => axiosMock.onPost(apiPaths.EDIT_WORKER).reply(200, mockSuccessfulResponse));

    test("defaultSkills and manager are both updated, Update button clicked, should update default_skills and manager attributes, show success modal overlay and hide after 2s", done => {
      const rendered = renderComponent();
      act(() => {
        const setManager = getMockedComponentProps(OutlinedSelect).updateValue;
        setManager(JSON.stringify(updatedManager));
      });
      act(() => {
        const setDefaultSkills = getMockedComponentProps(DefaultSkillSelector).setDefaultSkills;
        setDefaultSkills(updatedDefaultSkills);
      });
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: false
      });
      act(() => {
        const { onClick } = getMockedComponentProps(StyledButton);
        onClick();
        return Promise.resolve();
      }).then(() => {
        expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({
          workerSid,
          attributes: {
            default_skills: updatedDefaultSkills,
            manager_first_name: updatedManager.manager_first_name,
            manager_last_name: updatedManager.manager_last_name,
            manager_n_number: updatedManager.manager_n_number
          }
        }));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(mockSuccessfulResponse)
        });
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "User updated successfully",
          status: "success"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
    });

    test("defaultSkills is updated, Update button clicked, should only update default_skills attribute, show success modal overlay and hide after 2s", done => {
      const rendered = renderComponent();
      act(() => {
        const setDefaultSkills = getMockedComponentProps(DefaultSkillSelector).setDefaultSkills;
        setDefaultSkills(updatedDefaultSkills);
      });
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: false
      });
      act(() => {
        const { onClick } = getMockedComponentProps(StyledButton);
        onClick();
        return Promise.resolve();
      }).then(() => {
        expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({
          workerSid,
          attributes: {
            default_skills: updatedDefaultSkills
          }
        }));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(mockSuccessfulResponse)
        });
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "User updated successfully",
          status: "success"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
    });

    test("manager is updated, Update button clicked, should only update manager attribute, show success modal overlay and hide after 2s", done => {
      const rendered = renderComponent();
      act(() => {
        const setManager = getMockedComponentProps(OutlinedSelect).updateValue;
        setManager(JSON.stringify(updatedManager));
      });
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: false
      });
      act(() => {
        const { onClick } = getMockedComponentProps(StyledButton);
        onClick();
        return Promise.resolve();
      }).then(() => {
        expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({
          workerSid,
          attributes: {
            manager_first_name: updatedManager.manager_first_name,
            manager_last_name: updatedManager.manager_last_name,
            manager_n_number: updatedManager.manager_n_number
          }
        }));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(mockSuccessfulResponse)
        });
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "User updated successfully",
          status: "success"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
    });

    test("extension is updated, Update button clicked, should only update extension attribute, show success modal overlay and hide after 2s", done => {
      const rendered = renderComponent();
      const updatedExtension = "4567";
      act(() => {
        const props = getMockedComponentProps(ModalExtension);
        const form = props.form;
        props.updateValue(updatedExtension);
        props.setForm({
          ...form,
          extensionValid: true,
          extensionUpdated: true
        });
      });
      expectOnlyPassedProps(StyledButton, {
        children: "Update",
        disabled: false
      });
      act(() => {
        const { onClick } = getMockedComponentProps(StyledButton);
        onClick();
        return Promise.resolve();
      }).then(() => {
        expect(axiosMock.history.post[0].data).toEqual(JSON.stringify({
          workerSid,
          attributes: {
            extension: updatedExtension
          }
        }));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(mockSuccessfulResponse)
        });
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        expectOnlyPassedProps(StatusOverlay, {
          message: "User updated successfully",
          status: "success"
        });
        act(() => jest.runAllTimers());
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  test("clear extension called should reset the field", () => {
    renderComponent();
    act(() => {
      const updateValue = ModalExtension.mock.calls[0][0].updateValue;
      updateValue("2345");
    });
    let newValue = ModalExtension.mock.calls[1][0].extension;
    expect(newValue).toEqual("2345");
    act(() => {
      const clearExtension = ModalExtension.mock.calls[1][0].clearExtension;
      clearExtension();
    });
    newValue = ModalExtension.mock.calls[2][0].extension;
    expect(newValue).toEqual("");
    const props = getMockedComponentProps(ModalExtension);
    expect(props.form.extensionValid).toEqual(false);
    expect(props.form.extensionUpdated).toEqual(false);
  });

  describe("service call to update worker attributes fails", () => {
    const error = { nah: "boooo" };
    beforeEach(() => axiosMock.onPost(apiPaths.EDIT_WORKER).reply(500, error));
    test("StatusOverlay should render with 'User update failed' & modal should close overlay after 2 seconds", done => {
      const rendered = renderComponent();
      const { onClick } = getMockedComponentProps(StyledButton);
      act(() => {
        onClick();
        return Promise.resolve();
      }).then(() => {
        expectMockedComponent(rendered, { StatusOverlay }, 1);
        const saveStatus = getMockedComponentProps(StatusOverlay).status;
        expect(saveStatus).toBe("fail");
        const message = getMockedComponentProps(StatusOverlay).message;
        expect(message).toBe("Failed to update user");
        act(() => jest.runAllTimers());
        expectMockedComponent(rendered, { StatusOverlay }, 0);
        done();
      });
    });
  });
});