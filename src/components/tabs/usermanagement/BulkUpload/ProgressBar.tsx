import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller
} from "./BulkUpload.Styles";

const ProgressBar = (props: any) => {
  const {
    progress
  } = props;

  console.log("in progressbar", progress);
  return (
    <ProgressBarContainer>
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${progress}%` || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;