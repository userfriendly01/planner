import styled from "styled-components";

export const ControlItem = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  &:first-child {
    justify-content: flex-start;
    margin-right: auto;
  }
  &:last-child {
    justify-content: flex-end;
    margin-left: auto;
  }
`;

export const ControlsWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 1%;
`;

export const RightPadding = styled.div`
  padding-right: 8px;
`;