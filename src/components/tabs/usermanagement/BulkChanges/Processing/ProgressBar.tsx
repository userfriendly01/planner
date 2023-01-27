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

  const jokesIndexLength = jokes.length - 1;
  const [ selectedJokeIndex, setSelectedJokeIndex ] = React.useState(Math.floor((Math.random() * jokesIndexLength)));
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);

  console.log("***why arent I progressing?", totalRowCount, completedRows);

  React.useEffect(() => {
    const updateJoke = () => {
      const newJoke = Math.floor((Math.random() * jokesIndexLength));
      setSelectedJokeIndex(newJoke);
    };
    setInterval(updateJoke, 45000);
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