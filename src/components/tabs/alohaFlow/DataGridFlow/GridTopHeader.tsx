/* eslint-disable react/prop-types */
import React from "react";

function convertArrayOfObjectsToCSV(array:any) {
  let result:any;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);
  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item:any) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) {
        result += columnDelimiter;
      }
      result += item[key];
      ctr += 1;
    });
    result += lineDelimiter;
  });
  return result;
}

function downloadCSV(array:any) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv === null) {
    return;
  }
  const filename = `call-flow-${Date.now()}.csv`;
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

function isFilterable(idStart:any, idEnd:any, maxId:any) {
  if (idStart < 0 || idEnd < 0) {
    return false;
  }
  if (idStart >= idEnd) {
    return false;
  }
  return idEnd <= maxId;
}

function GridTopHeader(props:any) {
  const {
    data, filteredItems = [],
    idStart, idEnd, minId, maxId,
    filterRecords, resetFilterRecords,
    handleFilterInputChange,
    openAdvanceSearchModal,
    openAddModal,
    isFilterSelected
  } = props;

  const resetFilters = () => {
    const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";
    localStorage.removeItem(CACHE_FILTER_FLOW);
    resetFilterRecords();
  };

  // console.log("isSearchFilterSelected>", isFilterSelected());
  return (

    <div className="data-table-top-bar">
      <div className="data-table-filter">
        <div className="select-range">
          Select Range (
          {minId}
          -
          {maxId}
          )&nbsp;&nbsp;
          <input type="number" name="idStart" value={idStart} onChange={handleFilterInputChange} placeholder="From" />
          <input type="number" name="idEnd" value={idEnd} onChange={handleFilterInputChange} placeholder="To" />
        </div>
        <div className="data-table-export">
          <button type="button" value="Filter" disabled={!isFilterable(idStart, idEnd, maxId)} onClick={() => filterRecords()}>Filter</button>
          <button type="button" value="Reset" disabled={filteredItems.length === data.length && !isFilterSelected} onClick={() => resetFilters()}>Reset Filter</button>
          <button type="button" onClick={() => downloadCSV(filteredItems)}>Export</button>
        </div>
      </div>

      <div className="data-table-right">
        <div className="data-table-advance-search">
          <button type="button" onClick={() => openAdvanceSearchModal(true)}>{ isFilterSelected ? "**Advance Search" : "Advance Search"}</button>
        </div>
        <div className="data-table-add">
          <button type="button" onClick={() => openAddModal(true)}>Add Flow + </button>
        </div>
      </div>
    </div>
  );
}

export default GridTopHeader;
