import { Box } from "@mui/material";
import React from "react";
import {
  render, RenderResult, waitFor
} from "testUtils";
import { PhoneNumberDataGridProgressBar } from "../PhoneNumber.DataGrid.ProgressBar";

const mockContent = "Mock Content";
jest.mock("@mui/material", () => {
  const originalModule = jest.requireActual("@mui/material");
  return {
    ...originalModule,
    Box: jest.fn().mockImplementation(() => <div>{mockContent}</div>),
    LinearProgress: jest.fn(),
    Typography: jest.fn()
  };
});

/**
 * Renders the phone number data grid progress bar.
 * @param { Boolean } dataGridLoaded The boolean value to determine if most of the component should render.
 * @returns { RenderResult } The rendered result from the render function.
 */
const renderPhoneNumberDataGridProgressBar = (dataGridLoaded: boolean) => {
  return render(<PhoneNumberDataGridProgressBar
    recordCount={2}
    dataGridLoaded={dataGridLoaded}
  />
  );
};

/**
 * Checks to make sure the phone number data grid progress bar has loaded by looking for a specific element.
 * @param { Boolean } dataGridLoaded The boolean value to determine if most of the component should render.
 * @param { RenderResult } rendered result from the render function.
 */
const waitForPhoneNumberDataGridProgressBarToLoad = async (rendered: RenderResult, dataGridLoaded: boolean) => {
  await waitFor(() => {
    if (dataGridLoaded) {
      expect(rendered.queryByText(mockContent)).toBe(null);
    } else {
      expect(rendered.getByText(mockContent)).toBeDefined();
    }
  });
};

/**
 * Allows for spying on state setters by mocking the useState hook.
 * @param { Jest.Mock } mockSetProgress setProgress mock setter
 * @param { Jest.Mock } mockSetPreviousRecordCount setPreviousRecordCount mock setter
 */
const mockUseState = (mockSetProgress: jest.Mock, mockSetPreviousRecordCount: jest.Mock) => {
  jest.spyOn(React, "useState").mockReturnValueOnce([0, mockSetProgress]);
  jest.spyOn(React, "useState").mockReturnValueOnce([3, mockSetPreviousRecordCount]);
  jest.spyOn(React, "useState").mockReturnValueOnce([0, mockSetProgress]);
  jest.spyOn(React, "useState").mockReturnValueOnce([3, mockSetPreviousRecordCount]);
};

describe("PhoneNumber.DataGrid.ProgressBar", () => {
  let localStorageGetItemSpy: jest.SpyInstance;
  const mockSetProgress = jest.fn();
  const mockSetPreviousRecordCount = jest.fn();

  beforeEach(() => {
    localStorageGetItemSpy = jest.spyOn(Storage.prototype, "getItem").mockReturnValue(JSON.stringify({ previousRecordCount: 3 }));
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initial load", () => {
    it("should set the previous record count to the value stored in localStorage", async () => {
      mockUseState(mockSetProgress, mockSetPreviousRecordCount);
      const dataGridLoaded = false;
      await waitForPhoneNumberDataGridProgressBarToLoad(renderPhoneNumberDataGridProgressBar(dataGridLoaded), dataGridLoaded);

      expect(localStorageGetItemSpy).toHaveBeenCalledWith("PHONE_NUMBER_DATA_GRID_PROGRESS_BAR");
      expect(mockSetPreviousRecordCount).toHaveBeenCalledWith(3);
    });

    it("should render an empty div whe the data grid is not still loading", async () => {
      const dataGridLoaded = true;
      await waitForPhoneNumberDataGridProgressBarToLoad(renderPhoneNumberDataGridProgressBar(dataGridLoaded), dataGridLoaded);

      expect((Box as jest.Mock)).toHaveBeenCalledTimes(0);
    });

    it("should render the progress bar whe the data grid is still loading", async () => {
      const dataGridLoaded = false;
      await waitForPhoneNumberDataGridProgressBarToLoad(renderPhoneNumberDataGridProgressBar(dataGridLoaded), dataGridLoaded);

      expect((Box as jest.Mock)).toHaveBeenCalled();
    });

    it("should set a default value for dataGridLoaded to false if not provided", async () => {
      const dataGridLoaded = false;
      await waitForPhoneNumberDataGridProgressBarToLoad(render(<PhoneNumberDataGridProgressBar
        recordCount={2}
      />
      ), dataGridLoaded);
    });
  });

  describe("Progress calculation", () => {
    beforeEach(() => {
      mockUseState(mockSetProgress, mockSetPreviousRecordCount);
    });

    it("should set the progress bar progress to 100 if the data grid has already loaded", async () => {
      const initialDataGridLoad = false;
      await waitForPhoneNumberDataGridProgressBarToLoad(renderPhoneNumberDataGridProgressBar(initialDataGridLoad), initialDataGridLoad);
      const finalDataGridLoad = true;
      renderPhoneNumberDataGridProgressBar(finalDataGridLoad);

      expect(mockSetProgress).toHaveBeenCalledWith(100);
    });

    it("should call setProgress with an anonymous function that returns the calculated progress of the data grid load", async () => {
      const dataGridLoaded = false;
      await waitForPhoneNumberDataGridProgressBarToLoad(renderPhoneNumberDataGridProgressBar(dataGridLoaded), dataGridLoaded);

      const calculateProgressAnonymousFunction: (oldProgress: number) => number = mockSetProgress.mock.calls[0][0];

      expect(calculateProgressAnonymousFunction(2)).toBe(66);
      expect(calculateProgressAnonymousFunction(100)).toBe(0);
    });
  });
});