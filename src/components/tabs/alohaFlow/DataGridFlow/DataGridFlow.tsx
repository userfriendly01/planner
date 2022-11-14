/* eslint-disable react/prop-types */
/* class-methods-use-this,
   no-console,
   react/jsx-props-no-spreading
*/

import "Grid.scss";
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
import { CctSharedCallFlowDb } from "../AlohaFlow.Interfaces";


createTheme("gridTheme", { ...GridTheme }, "gridTheme");
const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";
const DataGridFlow = ({ accessToken }: { accessToken: string }) => {
  const [dataFlow, setDataFlow] = useState({
    "data": [],
    "filteredItems": [],
    "advanceFilter": [],
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
    setDataFlow((dataFlowProps:any) => ({
      ...dataFlowProps,
      "advanceFilter": getAdvanceFilter(),
      "page": sessionStorage.getItem("CALL_FLOW_PAGE_NO")|| 1,
      "perPage": sessionStorage.getItem("CALL_FLOW_PER_PAGE") || 10
    }));
    GridColumnDef[0].selector = (row: any) => (<a href="#" onClick={() => openEditModal(true, row, "Flow has been edited successfully")}>{row.id}</a>);
  }, []);

  const handleSearchDDChange = (event: any) => {
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      [event.target.name]: event.target.value
    }));
  };

  const handleFilterInputChange = (event: any) => {
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      [event.target.name]: event.target.value
    }));
  };

  const getAdvanceFilter = () => {
    let advanceFilter: any;
    try {
      const cachedFilter: any = localStorage.getItem(CACHE_FILTER_FLOW);
      advanceFilter = JSON.parse(cachedFilter) || {};
      Object.keys(advanceFilter).forEach(key => {
        if (advanceFilter[key] === "") {
          delete advanceFilter[key];
        }
      });
    } catch (e) {
      advanceFilter = {};
    }
    return advanceFilter;
  };

  const setPage = (val: any) => {
    sessionStorage.setItem("CALL_FLOW_PAGE_NO", val);
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "page": val
    }));
  };

  const setPerPage = (val: any) => {
    sessionStorage.setItem("CALL_FLOW_PER_PAGE", val);
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "perPage": val
    }));
  };

  const openEditModal = (flag: any, row: any, message: any) => {
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

  const openAddModal = (flag: any, ruleType: any) => {
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

  const openAdvanceSearchModal = (flag: any, advanceFilter: any) => {
    if (advanceFilter) {
      localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(advanceFilter));
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        "advanceFilter": advanceFilter
      }));
    }
    setDataFlow(dataFlowProps => ({
      ...dataFlowProps,
      "isAdvanceSearchModalOpen": flag
    }));
  };

  const showToastMessage = (type: any, message: any) => {
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
    if (result.length > 0) {
      result = result.sort((a: any, b: any) => a.pkey - b.pkey);
      result = result.map((item: any, index: any) => (
        {
          ...item, 
          id: index + 1
        }
        ));
      const minId = result[0].id;
      const maxId = result[result.length - 1].id;

      setDataFlow((dataFlowProps: any) => ({
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
      const advanceFilter = getAdvanceFilter();
      const advanceFilterLength = Object.keys(advanceFilter).length;
      if (advanceFilterLength > 0) {
        filterRecords();
      }
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        "masterData": masterData
      }));
    } else {
      setDataFlow((dataFlowProps: any) => ({
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

  const filterRecords = () => {
    const {
      data,
      idStart,
      idEnd
    } = dataFlow;
    const result = data.filter(
      item => item.id >= idStart && item.id <= idEnd
    );

    const advanceFilter = getAdvanceFilter();
    const advanceFilterLength = Object.keys(advanceFilter).length;
    if (advanceFilterLength > 0) {
      const advanceFilteredArray: any = [];
      result.forEach(item => {
        let matched = 0;
        Object.keys(advanceFilter).forEach(key => {
          let tempItem: any = item;
          if (key === "callFlowRoute") {
            tempItem = tempItem.content;
          }
          if (key === "pkey" && tempItem) {
            if (tempItem[key].includes(advanceFilter[key])) {
              matched += 1;
            }
          } else if (tempItem && tempItem[key] === advanceFilter[key]) {
            matched += 1;
          }
        });
        if (advanceFilterLength === matched) {
          advanceFilteredArray.push(item);
        }
      });
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        "filteredItems": advanceFilteredArray
      }));
    } else {
      setDataFlow(dataFlowProps => ({
        ...dataFlowProps,
        "filteredItems": result
      }));
    }
  };

  const resetFilterRecords = () => {
    const data: any = dataFlow["data"];
    const maxId = data[data.length - 1].id;
    setDataFlow((dataFlowProps: any) => ({
      ...dataFlowProps,
      "filteredItems": data,
      "idStart": data[0].id,
      "idEnd": maxId,
      "maxId": maxId,
      "advanceFilter": {}
    }));
  };


  return (
    <div className="data-grid">
      <div className="data-grid-wrapper">
        <div className="data-table-wrapper">
          <DataTable
            actions={(
              <GridTopHeader
                {...dataFlow}
                handleFilterInputChange={handleFilterInputChange}
                openAdvanceSearchModal={openAdvanceSearchModal}
                openAddModal={openAddModal}
                isFilterSelected={
                  Object.keys(getAdvanceFilter()).length > 0
                }
                filterRecords={filterRecords}
                resetFilterRecords={resetFilterRecords}
              />
            )}
            columns={GridColumnDef}
            customStyles={GridStyle}
            data={dataFlow["filteredItems"].slice((dataFlow["page"] - 1) * dataFlow["perPage"], dataFlow["page"] * dataFlow["perPage"])}
            defaultSortFieldId={1}
            highlightOnHover
            expandableRows
            onColumnOrderChange={(): void => (console.log(GridColumnDef))}
            pagination
            paginationServer
            paginationDefaultPage={dataFlow["page"]}
            paginationPerPage={dataFlow["perPage"]}
            paginationTotalRows={dataFlow["filteredItems"].length}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            persistTableHead
            pointerOnHover
            progressComponent={<GridSpinner />}
            progressPending={dataFlow["fetching"]}
            theme="gridTheme"
            onChangePage={(val: any) => setPage(val)}
            onChangeRowsPerPage={(val: any) => setPerPage(val)}
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
