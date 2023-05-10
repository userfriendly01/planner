import styled from "styled-components";

export const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 5px;
`;

export const FlexRow = styled.div`
  display: flex;
  padding: 5px;
  flex: 1 1 auto;
`;

export const FilterButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
`;

export const FlexRowMax = styled(FlexRow)`
  width: max-content;
`;

export const Header = styled.h1`
  align-self: center;
`;

export const ModalContainer = styled(FlexColumn)`
  font-family: 'Roboto', sans-serif;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self:center;
  padding: 5px;
`;