import styled from "styled-components";

export const Highlight = styled.span`
  color: ${props => props.theme.textColor};
`;

export const PageButton = styled.button<{pageSelected: number}>`
  background-color: ${props => props.value !== props.pageSelected ? "transparent" : props.theme.textColor};
  border: ${props => props.value !== props.pageSelected ? "#C0BFC0" : props => props.theme.textColor};
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
  color: #C0BFC0;
  cursor: pointer;
  margin: 0px 2px;
  outline: none;
  width: 30px;
`;

export const PageSection = styled.div`
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
