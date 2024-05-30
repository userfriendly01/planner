import { DataGridStateDeprecated } from "./DataGrid.State.Deprecated";
import { AlertBarState } from "../StateManager/AlertBar.State";
import { AlertBarStateManager } from "../StateManager/AlertBar.StateManager";
import {
  GridCallbackDetails, GridPaginationModel, GridRowId, GridRowSelectionModel
} from "@mui/x-data-grid";
import { ReactSetState } from "../StateManager/Abstract.ReactState";
import { PhoneNumberRecordType } from "../../phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

const ID = "id";

// export interface DataGridReactSetStateProps {
//   setPaginationModel: ReactSetState<GridPaginationModel>;
// }

export abstract class AbstractDataGridComponentManager<RecordType> {
  private readonly _dataGrid: DataGridStateDeprecated<RecordType>;
  private readonly _alertBar: AlertBarStateManager;
  private readonly _setPaginationModel: ReactSetState<GridPaginationModel>;

  constructor(dataGrid: DataGridStateDeprecated<RecordType>, alertBar: AlertBarStateManager, setPaginationModel: ReactSetState<GridPaginationModel>) {
    this._dataGrid = dataGrid;
    this._alertBar = alertBar;
    this._setPaginationModel = setPaginationModel;
  }

  get dataGrid(): DataGridStateDeprecated<RecordType> {
    return this._dataGrid;
  }

  get alertBar(): AlertBarState {
    return this._alertBar;
  }

  protected abstract retrieveData(accessToken: string): Promise<Array<RecordType>>;

  async loadDataGrid(accessToken: string): Promise<Array<RecordType>> {
    this.alertBar.info("Data loading in progress. Please wait for the complete set of data to be loaded.");

    let records = await this.retrieveData(accessToken);

    if (records?.length > 0) {
      records = records.sort((recordOne: RecordType, record2: RecordType) => ((recordOne[ID as keyof RecordType] as number) - (record2[ID as keyof RecordType] as number)));
      records = records.map((record: RecordType, index: number) => ({
        ...record,
        id: index + 1
      }));

      const minId: number = records[0][ID as keyof RecordType] as number;
      const maxId: number = records[records.length - 1][ID as keyof RecordType] as number;

      this.dataGrid.state = {
        data: records,
        filteredData: records,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        minId,
        maxId
      };

      //TODO: Filter records on an initial load?
      // if (Object.keys(this.getFilter()).length > 0) {
      //   this.filterRecords(records, minId, maxId);
      // }

      this.alertBar.success("Successfully loaded the phone number data.");

      return records;
    } else {
      this.dataGrid.state = {
        data: records,
        filteredData: records,
        fetching: false
      };

      this.alertBar.error("Error in retrieving records. Please check the console log");
    }

    return [];
  }

  protected abstract dataGridPageNumberCacheKey(): string;
  protected abstract dataGridRecordsPerPageCacheKey(): string;

  handlePaginationModelChange(model: GridPaginationModel, details: GridCallbackDetails<any>): void {
    sessionStorage.setItem(this.dataGridPageNumberCacheKey(), model.page.toString());
    sessionStorage.setItem(this.dataGridRecordsPerPageCacheKey(), model.pageSize.toString());
    this._setPaginationModel(model);
  }

  handleSelectionChanges(gridRowSelectionModel: GridRowSelectionModel): void{
    const selectedRows = gridRowSelectionModel.map((id: GridRowId) =>
      this._dataGrid.state.filteredData.find((phoneNumberRecord: PhoneNumberRecordType)=>
        phoneNumberRecord.id === id));

    this._dataGrid.state = {
      ...this._dataGrid.state,
      selectedList: selectedRows
    };
  }
}