import {
  AlertBarControllerRef,
  ReactSetState
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import {
  PHONE_NUMBER_DATA_GRID_PROGRESS_BAR_CACHE_KEY,
  PhoneNumberDataGridProgressBarInfo
} from "dynamicCallFlow/DataGrid/PhoneNumber.DataGrid.ProgressBar";
import { ALERT_BAR_15_SECOND_DURATION } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";

export class LoadDataGridMonitor {
  private readonly _setRecordCount: ReactSetState<number>;
  private _recordCount = 0;
  private readonly _setDataGridLoaded: ReactSetState<boolean>;
  private readonly _alertBarController: AlertBarControllerRef;
  private readonly _phoneNumberDataGridProgressBarInfo: PhoneNumberDataGridProgressBarInfo;

  constructor(setRecordCount: ReactSetState<number>, setDataGridLoaded: ReactSetState<boolean>, alertBarController: AlertBarControllerRef) {
    this._setRecordCount = setRecordCount;
    this._setDataGridLoaded = setDataGridLoaded;
    this._alertBarController = alertBarController;
    this._phoneNumberDataGridProgressBarInfo = (JSON.parse(localStorage.getItem(PHONE_NUMBER_DATA_GRID_PROGRESS_BAR_CACHE_KEY)) || {}) as PhoneNumberDataGridProgressBarInfo;
  }

  addToRecordCount(addToRecordCount: number): void {
    this._recordCount = this._recordCount + addToRecordCount;
    this._setRecordCount(this._recordCount);
    this._alertBarController?.current?.info(`Data loading in progress. Please wait for the complete set of data to be loaded.... ${this._recordCount}/~${this._phoneNumberDataGridProgressBarInfo.previousRecordCount || 25000}ish`, ALERT_BAR_15_SECOND_DURATION);
  }

  set dataGridLoaded(dataGridLoaded: boolean) {
    this._setDataGridLoaded(dataGridLoaded);
    if (dataGridLoaded) {
      this._alertBarController?.current?.success(`Data loaded ${this._recordCount} records successfully!`);
      localStorage.setItem(PHONE_NUMBER_DATA_GRID_PROGRESS_BAR_CACHE_KEY, JSON.stringify({ previousRecordCount: this._recordCount }));
    }
  }
}