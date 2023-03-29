import styled from "styled-components";
import {
  ModalBody,
  ModalFooter,
  Heading,
  Modal
} from "@lmig/lmds-react";

export const RoutingTableBox = styled.div`
width: 100%;
`;


export const RoutingModalBodyStyled = styled(ModalBody)`
  margin-top: 10px !important;
  overflow: auto;
  padding-top: 5px;
`;

export const RoutingModalFooterStyled = styled(ModalFooter)`
  margin-top: 5px !important;
  margin-bottom: 5px !important;
  margin-left: 40%;
  padding-top: 10px !important;
`;

export const RoutingHeadingStyled = styled(Heading)`
  margin-top:50px !important
`;

export const RoutingModalSearchStyled = styled(Modal)`
  width:60%
`;