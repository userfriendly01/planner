import React from "react";
import { useAdminState } from "context";
import WFMLoadRetryModal from "../../BulkChanges/WFMLoadRetryModal";

const WfmForm = () => {
  const state = useAdminState();
  
  return (
    <>
      { state.calabrioContext.wfmOptions ?
        <div>
          WFM FORM
        </div>
    : <WFMLoadRetryModal handleClose={() => {}}/>}
    </>
  )
}

export default WfmForm;