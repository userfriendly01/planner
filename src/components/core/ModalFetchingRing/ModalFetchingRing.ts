import styled, { keyframes } from "styled-components";

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const ModalFetchingRing = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #AAEDED;
    border-color: #AAEDED transparent #AAEDED transparent;
    animation: ${Spin} 1.2s linear infinite;
  }
`;
