import React from "react";
import { ModalOverlayStatuses } from "globals";
import { ModalFetchingRing } from "components";
import styled from "styled-components";

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  font-size: 25px;
`;

const InfoBanner = (props: any) => {
  const {
    status
  } = props;

  return (
    <InfoWrapper>
      { !status && <>Please select a business unit </> }
      { status === ModalOverlayStatuses.SAVING && <ModalFetchingRing/> }
      { status === ModalOverlayStatuses.FAIL && <>Users failed to load, please try again</>}
    </InfoWrapper>
  )
};

export default InfoBanner;