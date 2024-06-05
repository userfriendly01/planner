import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const Row = styled.div<{align?: string}>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align ? props.align : "space-evenly" };
  align-self: center;
  margin-top: 10px;
  width: 100%;
`;

export const StatusWrapper = styled.div<{align?: string}>`
  margin-top: 30px;
`;

export const Button = styled.button`
  margin: 0px 5px;
`;

export const OptionalColumnRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;