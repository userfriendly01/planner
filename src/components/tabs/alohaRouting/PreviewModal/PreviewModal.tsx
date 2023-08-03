import {
  DataGrid, GridColDef, useGridApiRef
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@lmig/lmds-react-modal";
import {
  StyledButton
} from "components";
import { Box } from "@mui/material";
import { CctSharedCallRoutingDb } from "../AlohaRouting.Interfaces";
import { TableGridColumnDef } from "./TableGridColumnDef";
import { batchDelete } from "services";
import {
  getGraphQLEndpoint
} from "utils";
import { reconstructTableColumnDef } from "./previewUtils";
import "./PreviewModal.css";

interface PreviewModalProps {
  accessToken: string;
  action: "delete" | "add" | "edit"
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onDelete?: (rows: Array<CctSharedCallRoutingDb>) => void;
  onUpdate?: (rows: Array<CctSharedCallRoutingDb>) => void;
  rows: Array<CctSharedCallRoutingDb>;
}

const PreviewModal = (props: PreviewModalProps): JSX.Element => {
  const {
    accessToken,
    action,
    isOpen,
    onClose,
    onCreate,
    onDelete,
    onUpdate,
    rows
  } = props;
  const apiRef = useGridApiRef();
  const graphQLEndPoint: string = getGraphQLEndpoint();
  const tableGridColumnDef: Array<GridColDef> = useMemo<Array<GridColDef>>(()=>{
    return reconstructTableColumnDef(action, [...TableGridColumnDef]); },[action]);

  const getUpdatedRoutingDb = () =>{
    const newRows: Array<CctSharedCallRoutingDb>=[...rows].map((row: CctSharedCallRoutingDb)=>{
      const updated: CctSharedCallRoutingDb = {} as unknown as CctSharedCallRoutingDb;
      Object.keys(row).forEach((key: string)=>{
        updated[key as keyof CctSharedCallRoutingDb] = apiRef.current.getCellValue(row.pkey, key);
      });
      return updated;
    });
    return newRows;
  };

  const handleOnCreate = () =>{
    const newRows:Array<CctSharedCallRoutingDb> = getUpdatedRoutingDb();
    onCreate(newRows);
  };

  const handleOnUpdate = () =>{
    const newRows:Array<CctSharedCallRoutingDb> = getUpdatedRoutingDb();
    onUpdate(newRows);
  };
  const handleOnDelete = async () => {
    const keysToDelete = rows.map(x => {
      return {
        pkey: x.pkey,
        skey: x.skey
      };
    }
    );
    const response = await batchDelete(keysToDelete, accessToken, graphQLEndPoint);

    if (response && !response.errors) {
      // openEditModal(false, true, rows, `${rows.length} Routing Rules deleted!! `, true);
      return true;
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        takeover={["base", "sm", "md", "lg"]}
        onClose={()=>{ onClose(); }}
        size="large"
      >
        <ModalHeader>Delete Routes - {rows.length} rows selected</ModalHeader>
        <ModalBody className="preview-grid-modal">
          <DataGrid
            rows={rows}
            columns={tableGridColumnDef}
            editMode="row"
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Box sx={{
            display: "flex",
            justifyContent: "center"
          }}>
            {action==="delete" &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ onDelete(rows); }}>Delete</StyledButton>
            }
            {action === "add" &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>handleOnCreate()}>Save</StyledButton>
            }
            {action === "edit" &&
            <StyledButton sx={{ marginRight: "15px" }} onClick={()=>{ handleOnUpdate(); }}>Update</StyledButton>
            }
            <StyledButton onClick={()=>{ onClose(); }}>Cancel</StyledButton>
          </Box>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export {
  PreviewModal,
  PreviewModalProps
};