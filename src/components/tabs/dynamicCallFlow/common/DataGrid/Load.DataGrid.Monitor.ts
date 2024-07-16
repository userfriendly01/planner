import { AlertBarControllerRef, ReactSetState } from "dynamicCallFlowCommon/DynamicCallFlow.Interfaces";
import { ALERT_BAR_15_SECOND_DURATION } from "dynamicCallFlowCommon/AlertBar.Controller";

export interface DataGridProgressBarInfo {
  previousRecordCount: number;
}

export default class LoadDataGridMonitor {
  private readonly _setRecordCount: ReactSetState<number>;
  private _recordCount = 0;
  private readonly _setDataGridLoaded: ReactSetState<boolean>;
  private readonly _alertBarController: AlertBarControllerRef;
  private readonly _dataGridProgressBarInfo: DataGridProgressBarInfo;
  private readonly _cacheKey: string;

  constructor(cacheKey: string, setRecordCount: ReactSetState<number>, setDataGridLoaded: ReactSetState<boolean>, alertBarController: AlertBarControllerRef) {
    this._setRecordCount = setRecordCount;
    this._setDataGridLoaded = setDataGridLoaded;
    this._alertBarController = alertBarController;
    this._cacheKey = cacheKey;
    this._dataGridProgressBarInfo = (JSON.parse(localStorage.getItem(cacheKey)) || {}) as DataGridProgressBarInfo;
  }

  addToRecordCount(addToRecordCount: number): void {
    this._recordCount = this._recordCount + addToRecordCount;
    this._setRecordCount(this._recordCount);
    this._alertBarController?.current?.info(`Data loading in progress. Please wait for the complete set of data to be loaded.... ${this._recordCount}/~${this._dataGridProgressBarInfo.previousRecordCount || 25000}ish`, ALERT_BAR_15_SECOND_DURATION);
  }

  set dataGridLoaded(dataGridLoaded: boolean) {
    this._setDataGridLoaded(dataGridLoaded);
    if (dataGridLoaded) {
      this._alertBarController?.current?.success(`Data loaded ${this._recordCount} records successfully!`);
      localStorage.setItem(this._cacheKey, JSON.stringify({ previousRecordCount: this._recordCount }));
    }
  }
}