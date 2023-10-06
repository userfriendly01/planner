import React from "react";
import {
  BannerHeader,
  BannerWrapper,
  BannerMessage
} from "./CompareProfiles.Styles";

const MessageBanner = (props: any) => {
  const {
    environment,
    messageArray,
    setMessageArray
  } = props;

  React.useEffect(() => {
    const devMessage = `Oh Hi there. This page is meant to compare and correct profiles across Triton, Calabrio QM, and Calabrio WFM. 
    Calabrio WFM is in Production only and Calabrio QM Non Prod should only be alighned in the Test environment with your Test Triton Worker.
    For this reason, this functionality is not used in this environment`;

    const testMessage = `Oh Hi there. This page is meant to compare and correct profiles across Triton, Calabrio QM, and Calabrio WFM. 
    Calabrio WFM is in Production only so you wont see that column in this environment.`;

    if (environment === "development") {
      setMessageArray((current: any) => [
        {
          level: "error",
          message: devMessage
        },
        ...current
      ]);
    } else if (environment === "test") {
      setMessageArray((current: any) => [
        {
          level: "error",
          message: testMessage
        },
        ...current
      ]);
    }
  }, []);

  return (
    <BannerWrapper >
      <BannerHeader>Messages</BannerHeader>
      {messageArray.map((m: any) => ((
        <BannerMessage level={m.level}>
          {m.message}
        </BannerMessage>))
      )}
    </BannerWrapper>
  );
};

export default MessageBanner;