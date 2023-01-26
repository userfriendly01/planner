import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "../BulkChanges.Styles";
import { getJokes } from "services";

const ProgressBar = (props: any) => {
  const {
    totalRowCount,
    completedRows
  } = props;

  const [ jokes, setJokes ] = React.useState(null);
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);
  console.log("in progressbar", percentageComplete);

  React.useEffect(() => {
    if(!jokes){
      try {
        const jokes = getJokes();
        setJokes(jokes);
        console.log("Jokes", jokes);
      } catch(err){
        console.error("Aww no jokes", err);
      }
    }
  }, []);

  return (
    <ProgressBarContainer>
      { jokes && <TextWrapper styles={{
        size: "26px"
      }}> We&apos;re working on it </TextWrapper>
      }
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${percentageComplete}%` || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;