import {
  FlexColumn,
  FlexRow
} from "globals";
import styled from "styled-components";

export const OrgWrapper = styled(FlexRow)`
  margin: 0px 50px;
`;

export const GroupColumn = styled(FlexColumn)`
  align-items: end;
  margin: 0px 20px;
  width: 150px;
`;

export const TeamColumn = styled(FlexColumn)`
  align-items: start;
  margin: 0px 20px;
  width: 150px;
  align-self: baseline;
  margin-top: 30px;
`;

export const Group = styled.div<{ selected: boolean }>`
  display: flex;
  margin-top: 20px;
  padding: 15px;
  font-size: 20px;
  color: ${props => props.selected ? props.theme.libertyDarkTeal : "black"};
  &:hover {
    cursor: pointer;
  };
`;

export const Team = styled(FlexColumn)`
  padding: 4px;
  font-size: 17px;
`;
