import LoadDataGridMonitor, { DataGridProgressBarInfo } from "dynamicCallFlowCommon/DataGrid/Load.DataGrid.Monitor";
import {
  ALERT_BAR_15_SECOND_DURATION, AlertBarController, AlertBarControllerRef
} from "dynamicCallFlowCommon/AlertBar.Controller";
import {
  ReactSetState
} from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";

import { MockLocalStorage } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";

describe("LoadDataGridMonitor", () => {
  Object.defineProperty(window, "localStorage", { value: MockLocalStorage });
  let alertBarController: AlertBarController;
  let alertBarControllerRef: AlertBarControllerRef;
  let dataGridProgressBarInfo: DataGridProgressBarInfo;

  beforeEach(() => {
    dataGridProgressBarInfo = { previousRecordCount: 25000 };
    localStorage.setItem("testKey", JSON.stringify(dataGridProgressBarInfo));
    alertBarController = new AlertBarController(jest.fn());
    alertBarControllerRef = {
      current: alertBarController
    } as AlertBarControllerRef;
  });

  it("shouldInitializeWithGivenCacheKeyAndSetters", () => {
    const setRecordCount: ReactSetState<number> = jest.fn();
    const setDataGridLoaded: ReactSetState<boolean> = jest.fn();
    const monitor = new LoadDataGridMonitor("testKey", setRecordCount, setDataGridLoaded, alertBarControllerRef);
    expect(monitor["_cacheKey"]).toBe("testKey");
    expect(monitor["_setRecordCount"]).toBe(setRecordCount);
    expect(monitor["_setDataGridLoaded"]).toBe(setDataGridLoaded);
    expect(monitor["_alertBarController"]).toBe(alertBarControllerRef);
  });

  it("shouldAddToRecordCountAndUpdateState", () => {
    const setRecordCount = jest.fn();
    const setDataGridLoaded = jest.fn();
    const spyOneAlerBarControllerInfo = jest.spyOn(alertBarControllerRef.current, "info");
    const monitor = new LoadDataGridMonitor("testKey", setRecordCount, setDataGridLoaded, alertBarControllerRef);
    monitor.addToRecordCount(5);
    expect(monitor["_recordCount"]).toBe(5);
    expect(setRecordCount).toHaveBeenCalledWith(5);
    expect(spyOneAlerBarControllerInfo).toHaveBeenCalledWith(expect.stringContaining("5/~25000ish"), ALERT_BAR_15_SECOND_DURATION);
  });

  it("shouldSetDataGridLoadedAndUpdateState", () => {
    const setRecordCount = jest.fn();
    const setDataGridLoaded = jest.fn();
    const spyOneAlerBarControllerSuccess = jest.spyOn(alertBarControllerRef.current, "success");
    const monitor = new LoadDataGridMonitor("testKey", setRecordCount, setDataGridLoaded, alertBarControllerRef);
    monitor.addToRecordCount(5);
    monitor.dataGridLoaded = true;
    expect(setDataGridLoaded).toHaveBeenCalledWith(true);
    expect(spyOneAlerBarControllerSuccess).toHaveBeenCalledWith("Data loaded 5 records successfully!");
    expect(localStorage.getItem("testKey")).toBe(JSON.stringify({ previousRecordCount: 5 }));
  });

  it("shouldHandleEmptyPreviousRecordCount", () => {
    localStorage.setItem("testKey", JSON.stringify({}));
    const setRecordCount = jest.fn();
    const setDataGridLoaded = jest.fn();
    const spyOneAlerBarControllerInfo = jest.spyOn(alertBarControllerRef.current, "info");
    const monitor = new LoadDataGridMonitor("testKey", setRecordCount, setDataGridLoaded, alertBarControllerRef);
    monitor.addToRecordCount(5);
    expect(spyOneAlerBarControllerInfo).toHaveBeenCalledWith(expect.stringContaining("5/~25000ish"), ALERT_BAR_15_SECOND_DURATION);
  });

  it("shouldHandleNonEmptyPreviousRecordCount", () => {
    localStorage.setItem("testKey", JSON.stringify({ previousRecordCount: 10000 }));
    const setRecordCount = jest.fn();
    const setDataGridLoaded = jest.fn();
    const spyOneAlerBarControllerInfo = jest.spyOn(alertBarControllerRef.current, "info");
    const monitor = new LoadDataGridMonitor("testKey", setRecordCount, setDataGridLoaded, alertBarControllerRef);
    monitor.addToRecordCount(5);
    expect(spyOneAlerBarControllerInfo).toHaveBeenCalledWith(expect.stringContaining("5/~10000ish"), ALERT_BAR_15_SECOND_DURATION);
  });
});