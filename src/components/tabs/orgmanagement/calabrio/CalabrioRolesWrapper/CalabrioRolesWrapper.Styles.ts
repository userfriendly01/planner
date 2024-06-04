import {
  FlexColumn,
  FlexRow
} from "globals/styles";
import styled from "styled-components";

export const RolesWrapper = styled(FlexRow)`
  margin: 0px 50px;
`;

export const RolesColumn = styled(FlexColumn)`
  align-items: end;
  margin: 0px 20px;
  width: 150px;
`;

export const PermissionsColumn = styled(FlexColumn)`
  align-items: start;
  margin: 0px 20px;
  width: 150px;
  align-self: baseline;
  margin-top: 30px;
`;

export const Role = styled.div<{ selected: boolean }>`
  display: flex;
  margin-top: 20px;
  padding: 15px;
  font-size: 20px;
  color: ${props => props.selected ? props.theme.libertyDarkTeal : "black"};
  &:hover {
    cursor: pointer;
  };
`;

export const Permission = styled(FlexColumn)`
  padding: 3px;
  font-size: 17px;
`;
