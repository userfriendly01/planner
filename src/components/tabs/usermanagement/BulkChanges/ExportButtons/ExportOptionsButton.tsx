
import { Button } from "../BulkChanges.Styles";
import { Template } from "../BulkChanges.Interfaces";
import BusinessUnitModal from "../BusinessUnitModal";
import { Modal } from "@mui/material";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportOptionsButton = (props: any) => {
  const {
    template,
    state,
    selectedTemplates
  } = props;

  const [ wfmBusinessUnit, setWfmBusinessUnit ] = React.useState(null);
  const [ showBusinessUnitModal, setShowBusinessUnitModal ] = React.useState(false);

  const isWFMSelected: boolean = selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_USER");

  const _export = React.useRef(null);
  console.log("ExportOptionsButton Template", template);
  console.warn("_export", _export);
  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    template.forEach((t: any) => {
      if(t.options){
        let options = [];
        if (t.field.includes("wfm")) {
          console.log("wfmBusinessUnit in export options: ", wfmBusinessUnit.value);
          options = t.options(state, wfmBusinessUnit.value);
        } else {
          options = t.options(state);
        }
        if(options.length > 0){
          columns.push({
            field: t.field,
            title: t.name,
            width: t.width,
            options: options,
            wrap: true,
            textAlign: "center"
          });
        }
      }
    });

    columns.forEach((c: any) => {
      const field = c.field;
      const options = c.options;
      options.forEach((o: any, i: number) => {
        if(rows[i]){
          rows[i][field] = o;
        } else {
          rows.push({
            [field]: o
          });
        }
      });
    });

    console.log("rows", rows);
    console.log("columns", columns);

    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  const handleClick = () => {
    if (isWFMSelected) {
      setShowBusinessUnitModal(true);
    } else {
      handleExport();
    }
  };

  return (
    <>
      { isWFMSelected && (
        <Modal open={showBusinessUnitModal} onClose={() => { return; }} >
          <BusinessUnitModal
            setWfmBusinessUnit={setWfmBusinessUnit}
            setShowBusinessUnitModal={setShowBusinessUnitModal}
            wfmBusinessUnit={wfmBusinessUnit}
            handleExport={handleExport}
          />
        </Modal>
      )}
      <Button onClick={handleClick}>
        <ExcelExport ref={_export}/>
        Export Template Options
      </Button>
    </>
  );
};

export default ExportOptionsButton;