import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "../BulkChanges.Styles";

const ProgressBar = (props: any) => {
  const {
    totalRowCount,
    completedRows
  } = props;

  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);
  console.log("in progressbar", percentageComplete);

  return (
    <ProgressBarContainer>
      <TextWrapper styles={{
        size: "26px"
      }}>
          Were working on it
      </TextWrapper>
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${percentageComplete}%` || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;