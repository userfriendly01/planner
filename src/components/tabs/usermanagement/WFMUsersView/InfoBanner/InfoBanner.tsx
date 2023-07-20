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
    status,
    options
  } = props;

  return (
    <InfoWrapper>
      { options.length > 0 ?
        <>
        { !status && <>Please select a business unit </> }
        { status === ModalOverlayStatuses.SAVING && <ModalFetchingRing/> }
        { status === ModalOverlayStatuses.FAIL && <>Users failed to load, please try again</>}
        </>
        : <> WFM Options did not load, please refresh triton and try again </>
      }
      
    </InfoWrapper>
  )
};

export default InfoBanner;