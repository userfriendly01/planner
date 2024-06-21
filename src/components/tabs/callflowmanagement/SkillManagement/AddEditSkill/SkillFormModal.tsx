
import { Modal } from "@mui/material";
import React from "react";
import { AddEditForm } from "./AddEditForm";
import { DeleteForm } from "./DeleteForm";
import { ActionTypes } from "../Skills.Interfaces";

export const SkillFormModal = (props: any) => {
  const [ showSkillModal, setShowSkillModal ] = React.useState(true);

  const {
    action,
    tableState,
    setTableState,
    setSaveResult,
    setAction
  } = props;

  return (
    <Modal open={showSkillModal}>
      { action === ActionTypes.DELETE ? <DeleteForm
        setAction={setAction}
        tableState={tableState}
        setTableState={setTableState}
        closeModal={() => {
          setShowSkillModal(false);
          setSaveResult({
            message: "",
            status: null
          });
        }}
        setSaveResult={setSaveResult}
      /> :
        <AddEditForm
          closeModal={() => {
            setShowSkillModal(false);
            setSaveResult({
              message: "",
              status: null
            });
          }}
          setAction={setAction}
          setSaveResult={setSaveResult}
        />
      }
    </Modal>
  );
};