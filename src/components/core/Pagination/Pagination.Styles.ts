import styled from "styled-components";

export const Highlight = styled.span`
  color: ${props => props.theme.textColor};
`;

export const NavArrow = styled.span<{disabled: boolean}>`
  border-radius: 50%;
  color: ${props => props.disabled ? props.theme.navArrow.disabledColor.disabledGrey : props.theme.textColor};
  display: inline-block;
  height: 25px;
  margin: 0 1px 0 1px;
  width: 25px;
  &:hover {
    background-color: ${props => props.theme.navArrow.hoverColor};
    cursor: pointer;
  }
`;

export const NavArrowsWrapper = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

export const PaginationWrapper = styled.div`
  background-color: white;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
  position: sticky;
`;

export const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
`;