import EditUserModal from "../EditUserModal";
import { CloseRounded } from "@material-ui/icons";
import MockAdapter from "axios-mock-adapter";
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
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
  CustomButton: jest.fn(),
  CustomSelect: jest.fn(),
  ModalHeader: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const mockWorker = {
  sid: "WK023315648120514",
  attributes: {
    full_name: "Faith Cuneo",
    manager_n_number: "n0999887",
    n_number: "n0263786"
  }
};

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

const mockSuccessfulResponse = {
  sid: "WK123456789",
  friendlyName: "Test Worker",
  attributes: "{\"skill\":\"466\"}"
};

const mockHandleClose = jest.fn();

const initialTestState = {
  ...initialState,
  managerContext: {
    managers: mockManagers
  }
};

const renderComponent = () => {
  return render(<EditUserModal handleClose={mockHandleClose} worker={mockWorker} />, initialTestState);
};

describe("<EditUserModal />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CloseRounded,
      CustomButton,
      CustomSelect,
      ModalHeader,
      ModalOverlay
    });
    mockHandleClose.mockClear();
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("EditUserModal is in its initial state", () => {
    test("EditUserModal Renders the appropriate elements", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { ModalHeader }, 1);
      expectMockedComponent(rendered, { CloseRounded }, 1);
      expectMockedComponent(rendered, { CustomSelect }, 1);
      expectMockedComponent(rendered, { CustomButton }, 1);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Update",
        disabled: true
      }, 0);
      expect(getMockedComponentProps(ModalHeader, getLastInstanceCalled(ModalHeader)).children).toBe("Update User's Manager");
    });
  });

  describe("EditUserModal Manager List in its initial state", () => {
    test("EditUserModal shows the correct manager list is in its initial state", () => {
      renderComponent();
      const expectedManagerProps = {
        // label: "Manager",
        optionsList: mockManagers
      };
      expectOnlyPassedProps(CustomSelect, expectedManagerProps, 0);
      const optionsDisplayFunc = CustomSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(mockManagers[0]);
      expect(option).toEqual({
        display: `${mockManagers[0].manager_first_name} ${mockManagers[0].manager_last_name}`,
        key: mockManagers[0].manager_n_number,
        value: JSON.stringify(mockManagers[0])
      });
    });
  });

  describe("update Button", () => {
    test("the initial state update should be disabled, and close should be enabled", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomButton }, 1);
      expectOnlyPassedProps(CustomButton, {
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

  describe("New Manager is selected", () => {
    test("changes made to the manager dropdown", () => {
      renderComponent();
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(mockManagers[0]));
      });
      expect(CustomSelect.mock.calls.length).toBe(2);
      const newValue = CustomSelect.mock.calls[1][0].value;
      expect(newValue).toEqual(JSON.stringify(mockManagers[0]));
    });

    test("update button should be enabled", done => {
      renderComponent();
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(mockManagers[0]));
        return Promise.resolve();
      }).then(() => {
        expect(CustomButton.mock.calls.length).toBe(2);
        expectOnlyPassedProps(CustomButton, {
          children: "Update",
          disabled: false
        }, 1);
        done();
      });
    });
  });

  describe("Edit User button is clicked", () => {
    describe("Success", () => {
      test("ModalOverlay should render with 'User updated successfully' & modal should close after 2 seconds (handleClose should be called)", done => {
        axiosMock.onPost(apiPaths.EDIT_WORKER).reply(200, mockSuccessfulResponse);
        const rendered = renderComponent();
        act(() => {
          const updateValue = CustomSelect.mock.calls[0][0].updateValue;
          updateValue(JSON.stringify(mockManagers[0]));
          return Promise.resolve();
        }).then(() => {
          expectOnlyPassedProps(CustomButton, {
            children: "Update",
            disabled: false
          }, 1);
          const { onClick } = CustomButton.mock.calls[1][0];
          act(() => {
            onClick();
            return Promise.resolve();
          }).then(() => {
            expectMockedComponent(rendered, { ModalOverlay }, 1);
            const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
            expect(saveStatus).toBe("success");
            act(() => jest.runAllTimers());
            expect(mockHandleClose).toBeCalled();
            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions[0]).toEqual({
              type: "updateWorker",
              payload: mapWorkerFromTwilioWorker(mockSuccessfulResponse)
            });
            done();
          });
        });
      });
    });
    describe("Failure", () => {
      test("ModalOverlay should render with 'User update failed' & modal should close after 2 seconds (handleClose should be called)", done => {
        axiosMock.onPost(apiPaths.EDIT_WORKER).networkError();
        const rendered = renderComponent();
        act(() => {
          const updateValue = CustomSelect.mock.calls[0][0].updateValue;
          updateValue(JSON.stringify(mockManagers[0]));
          return Promise.resolve();
        }).then(() => {
          expectOnlyPassedProps(CustomButton, {
            children: "Update",
            disabled: false
          }, 1);
          const { onClick } = CustomButton.mock.calls[1][0];
          act(() => {
            onClick();
            return Promise.resolve();
          }).then(() => {
            expectMockedComponent(rendered, { ModalOverlay }, 1);
            const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
            expect(saveStatus).toBe("fail");
            act(() => jest.runAllTimers());
            done();
          });
        });
      });
    });
  });
});