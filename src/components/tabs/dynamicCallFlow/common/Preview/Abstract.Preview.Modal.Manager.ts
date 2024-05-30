import { DataGridState } from "../DataGrid/DataGrid.State";
import { AlertBarStateManager } from "../StateManager/AlertBar.StateManager";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import {PreviewModalActionType} from "./Preview.Interface";

export abstract class AbstractPreviewModalManager<RecordType> {
  private readonly _dataGrid: DataGridState<RecordType>;
  private readonly _alertBar: AlertBarStateManager;
  private readonly _apiRef: React.MutableRefObject<GridApiCommunity>;

  constructor(dataGrid: DataGridState<RecordType>, alertBar: AlertBarStateManager, apiRef: React.MutableRefObject<GridApiCommunity>) {
    this._dataGrid = dataGrid;
    this._alertBar = alertBar;
    this._apiRef = apiRef;
  }

  openModal(previewModalAction: PreviewModalActionType): void {
    this._dataGrid.state = {
      isPreviewModalOpen: true,
      previewModalAction: previewModalAction
    };
  }

  closeModal(): void {
    this._dataGrid.state = {
      isPreviewModalOpen: false
    };
  }

  handleOnClose():void {
    this.closeModal();
    this._apiRef.current.setRowSelectionModel([]);
  }
}