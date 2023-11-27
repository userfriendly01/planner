import styled from "styled-components";
import {
  ModalBody,
  ModalFooter,
  Modal
} from "@lmig/lmds-react-modal";
import { Heading } from "@lmig/lmds-react-typography";

export const RoutingTableBox = styled.div`
width: 100%;
`;


export const RoutingModalBodyStyled = styled(ModalBody)`
  overflow: auto;
  padding-top: 8px;
  margin-top: none !important;
`;

export const RoutingModalFooterStyled = styled(ModalFooter)`
  margin-top: 5px !important;
  margin-bottom: 5px !important;
  display: flex;
  justify-content: center;
  padding-top: 10px !important;
`;

export const RoutingHeadingStyled = styled(Heading)`
  padding: 30px 0px 20px 20px
`;

export const RoutingModalSearchStyled = styled(Modal)`
  width:60%
`;