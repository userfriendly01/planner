import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "../BulkChanges.Styles";
import { jokes } from "../BulkUtils/jokes";

const ProgressBar = (props: any) => {
  const {
    totalRowCount,
    completedRows
  } = props;

  const [ selectedJokeIndex, setSelectedJokeIndex ] = React.useState(0);
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);
  console.log("in progressbar", percentageComplete);

  React.useEffect(() => {
    //set interval and update selected joke
    console.log(Math.floor((Math.random() * jokes.length)));
  }, []);

  return (
    <ProgressBarContainer>
      <TextWrapper styles={{
        size: "26px"
      }}> {jokes[selectedJokeIndex]} </TextWrapper>
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${percentageComplete}%` || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;