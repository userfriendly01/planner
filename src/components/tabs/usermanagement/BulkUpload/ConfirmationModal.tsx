import React from "react";
import { ExportErrorsButton } from "./ExportButtons/ExportErrorsButton";

const ConfirmationModal = (props: any) => {
  const {
    validationErrors
  } = props;
  //if there are validation errors, show export validation button and provide options to cancel or proceed with valid rows
  //if user selects proceed - hide confirmation form and show progress bar
  return (
    <div>
      Validation Errors have been found for this template.
      <ExportErrorsButton errors={validationErrors}/>
    </div>
  );
};

export default ConfirmationModal;