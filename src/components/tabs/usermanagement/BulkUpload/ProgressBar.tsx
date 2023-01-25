import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller
} from "./BulkUpload.Styles";

const ProgressBar = (props: any) => {
  const {
    percentageComplete
  } = props;

  return (
    <ProgressBarContainer>
      <ProgressBarWrapper>
        <ProgressBarFiller progress={percentageComplete || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;