
import { Modal } from "@mui/material";
import React from "react";
import { AddEditForm } from "callflowmanagement/AddEditForm";
import { DeleteForm } from "callflowmanagement/DeleteForm";
import { ActionTypes } from "callflowmanagement/Skills.Interfaces";

export const SkillFormModal = (props: any) => {
  const {
    action,
    tableState,
    setTableState,
    setSaveResult,
    setAction
  } = props;

  return (
    <Modal open={!!action}>
      { action === ActionTypes.DELETE ? <DeleteForm
        setAction={setAction}
        tableState={tableState}
        setTableState={setTableState}
        closeModal={() => {
          setAction(null);
          setSaveResult({
            message: "",
            status: null
          });
        }}
        setSaveResult={setSaveResult}
      /> :
        <AddEditForm
          closeModal={() => {
            setAction(null);
            setSaveResult({
              message: "",
              status: null
            });
          }}
          action={action}
          tableState={tableState}
          setAction={setAction}
          setSaveResult={setSaveResult}
        />
      }
    </Modal>
  );
};