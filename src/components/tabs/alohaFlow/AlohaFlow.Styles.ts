import styled from "styled-components";
import {
  ModalBody,
  ModalFooter,
  Modal
} from "@lmig/lmds-react-modal";
import { Heading } from "@lmig/lmds-react-typography"

export const ModalBodyStyled = styled(ModalBody)`
  margin-top: 10px !important;
  overflow: auto;
  padding-top: 5px;
`;

export const ModalFooterStyled = styled(ModalFooter)`
  margin-top: 5px !important;
  margin-bottom: 5px !important;
  margin-left: 40%;
  padding-top: 10px !important;
`;

export const HeadingStyled = styled(Heading)`
  margin-top:50px !important
`;
export const ModalSearchStyled = styled(Modal)`
  width:60%
`;
