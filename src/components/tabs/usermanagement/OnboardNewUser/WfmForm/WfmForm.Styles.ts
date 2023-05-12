import styled from "styled-components";


export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Row = styled.div<{align?: string}>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align ? props.align : "space-evenly" };
  align-self: center;
  margin-top: 10px;
  width: 100%;
`;

export const Button = styled.button`
  margin: 0px 5px;
`;