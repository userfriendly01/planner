/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/

import "./Grid.scss";
import "react-toastify/dist/ReactToastify.css";
import DataTable, { createTheme } from "react-data-table-component";
import{
  ToastContainer,
  toast
} from "react-toastify";
import React,{
  useState,
  useEffect
} from "react";
import { getGridMasterData } from "./GridMaster";
import GridColumnDef from "./GridColumnDef";
import GridSpinner from "./GridSpinner";
import { GridStyle } from "./GridStyle";
import GridTheme from "./GridTheme";
import GridTopHeader from "./GridTopHeader";
import { retrieveFlowData } from "services";
import{
  CctSharedCallFlowDb,
  FlowAdvanceFilter
} from "../AlohaFlow.Interfaces";

createTheme("gridTheme", { ...GridTheme }, "gridTheme");
const DataGridFlow = ({ accessToken }: { accessToken: string }) => {
  const [dataFlow, setDataFlow] = useState({
    "data": [],
    "filteredItems": [],
    "advanceFilter": Array<FlowAdvanceFilter>,
    "fetching": true,
    "selectedRow": undefined,
    "isEditModalOpen": false,
    "isAddModalOpen": false,
    "isAdvanceSearchModalOpen": false,
    "idStart": 0,
    "idEnd": 0,
    "maxId": 0,
    "minId": 0,
    "saveSuccess": 0,
    "page": 1,
    "perPage": 10
  });

  useEffect(() => {
    loadDataTable();
    setDataFlow((dataFlowProps: any) => ({
      ...dataFlowProps,
      "page": sessionStorage.getItem("CALL_FLOW_PAGE_NO")|| 1,
      "perPage": sessionStorage.getItem("CALL_FLOW_PER_PAGE") || 10
    }));
  }, []);

  const handleFilterInputChange = (event: any ) => {
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      [event.target.name]: event.target.value
    }));
  };

  const setPage = (newPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PAGE_NO", newPage.toString());
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "page": newPage
    }));
  };

  const setPerPage = (newPerPage: number) => {
    sessionStorage.setItem("CALL_FLOW_PER_PAGE", newPerPage.toString());
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "perPage": newPerPage
    }));
  };

  const openEditModal = (flag: boolean, row: any, message: string) => {
    if (!flag && row) {
      showToastMessage("success", message);
      loadDataTable();
    }
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "isEditModalOpen": flag,
      "selectedRow": row
    }));
  };

  const openAddModal = (flag:boolean, ruleType: number) => {
    if (!flag && ruleType) {
      showToastMessage(
        "success",
        "New flow has been successfully added!! "
      );
      loadDataTable();
    }
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "isAddModalOpen": flag
    }));
  };

  const showToastMessage = (type: string, message: string) => {
    toast(message, {
      position: "top-center",
      autoClose: 1500,
      className: "success-toast",
      //type,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined
    });
  };

  const loadDataTable = async () => {
    let result: CctSharedCallFlowDb[] = await retrieveFlowData(accessToken);
    if(result.length > 0) {
      result = result.sort((a: any, b: any) => a.pkey - b.pkey);
      result = result.map((item: any, index: any) => (
        {
          ...item,
          id: index + 1
        }
      ));
      const minId = result[0].id;
      const maxId = result[result.length - 1].id;

      setDataFlow((dataFlowProps:any) => ({
        ...dataFlowProps,
        "data": result,
        "filteredItems": result,
        "fetching": false,
        "idStart": minId,
        "idEnd": maxId,
        "maxId": maxId,
        "minId": minId
      }));
      const masterData = getGridMasterData(result);
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        "masterData": masterData
      }));
    } else {
      setDataFlow((dataFlowProps:any) => ({
        ...dataFlowProps,
        "data": result,
        "filteredItems": result,
        "fetching": false
      }));
      showToastMessage(
        "error",
        "Error in retriving Flow record. Please check the API Key "
      );
    }
  };

  return (
    <div className="data-grid-wrapper">
      <div className="data-grid-wrapper">
        <div className="data-grid-wrapper">
          <DataTable
            actions={(
              <GridTopHeader
                {...dataFlow}
                handleFilterInputChange={handleFilterInputChange}
                openAddModal={openAddModal}
              />
            )}
            columns={GridColumnDef}
            customStyles={GridStyle}
            data={dataFlow.filteredItems.slice((dataFlow.page - 1) * dataFlow.perPage, dataFlow.page* dataFlow.perPage)}
            defaultSortFieldId={1}
            highlightOnHover
            expandableRows
            onColumnOrderChange={(): void => (console.log(GridColumnDef))}
            pagination
            paginationServer
            paginationDefaultPage={dataFlow.page}
            paginationPerPage={dataFlow.perPage}
            paginationTotalRows={dataFlow.filteredItems.length}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            persistTableHead
            pointerOnHover
            progressComponent={<GridSpinner />}
            progressPending={dataFlow.fetching}
            theme="gridTheme"
            onChangePage={(newPage: number) => setPage(newPage)}
            onChangeRowsPerPage={(newPerPage: number) => setPerPage(newPerPage)}
          />
        </div>
      </div>

      {/* <AddModal
          accessToken={props.accessToken}
          isOpen={dataFlow["isAddModalOpen"]}
          newId={dataFlow["maxId"] + 1}
          openModal={openAddModal}
          onClose={() => {
            openAddModal(false);
            return true;
          }}
        />*/}

      {/*<EditModal
          accessToken={props.accessToken}
          isOpen={dataFlow["isEditModalOpen"]}
          className="data-grid-modal"
          selectedRow={dataFlow["selectedRow"]}
          openModal={openEditModal}
          onClose={() => {
            openEditModal(false);
            return true;
          }}
        />*/}

      {/*<AdvanceSearchModal
          isOpen={dataFlow["isAdvanceSearchModalOpen"]}
          className="data-grid-modal"
          selection={dataFlow["advanceFilter"]}
          openModal={openAdvanceSearchModal}
          handleChange={handleSearchDDChange}
          masterData={dataFlow["masterData"]}
          applyFilter={filterRecords}
          resetMasterData={clearGridMasterData}
          onClose={() => {
            openAdvanceSearchModal(false);
            return true;
          }}
        />*/}

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        pauseOnHover={false}
      />
    </div>
  );
};

export default DataGridFlow;


