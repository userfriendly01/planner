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

  const [ selectedJokeIndex, setSelectedJokeIndex ] = React.useState(Math.floor((Math.random() * jokes.length)));
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);
  console.log("in progressbar", percentageComplete);

  React.useEffect(() => {
    const updateJoke = () => {
      const newJoke = Math.floor((Math.random() * jokes.length));
      setSelectedJokeIndex(newJoke);
    };
    setInterval(updateJoke, 75000);
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