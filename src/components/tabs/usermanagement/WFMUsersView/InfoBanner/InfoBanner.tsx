import React from "react";
import { ModalOverlayStatuses } from "globals";
import { ModalFetchingRing } from "components";

const InfoBanner = (props: any) => {
  const {
    status
  } = props;

  return (
    <div>
      { !status && <>Please select a business unit </> }
      { status === ModalOverlayStatuses.SAVING && <ModalFetchingRing/> }
      { status === ModalOverlayStatuses.FAIL && <>Users failed to load, please try again</>}
    </div>
  )
};

export default InfoBanner;