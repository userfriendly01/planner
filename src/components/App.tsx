import styled from "styled-components";
import React from "react";
import { PlannerTemplate } from "./planner/PlannerTemplate";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #abbdcc;
`;

const App = (): React.JSX.Element => {
  return (
    <Wrapper>
      <PlannerTemplate />
    </Wrapper>
  );
};

export default App;
