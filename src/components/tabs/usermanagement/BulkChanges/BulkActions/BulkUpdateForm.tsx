import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import { updateSelectedTemplates } from "../BulkUtils/utils";
import { getUpdateTemplates } from "../BulkUtils/templates";
import { useAdminState } from "context";
import React from "react";


const BulkUpdateForm = (props: any) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

  return (
    <Row>
     Bulk Update Changes!
    </Row>
  );
};

export default BulkUpdateForm;