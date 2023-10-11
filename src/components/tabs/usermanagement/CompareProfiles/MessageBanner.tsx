import React from "react";
import {
  BannerWrapper,
  BannerMessage
} from "./CompareProfiles.Styles";
import { Close } from "@mui/icons-material";
import { messageConsts } from "./messages";

const MessageBanner = (props: any) => {
  const {
    environment,
    messages,
    updateMessages,
  } = props;

  React.useEffect(() => {
    if (environment === "development") {
      updateMessages("add", null, messageConsts.DEV_MESSAGE, "error");
    } else if (environment === "test") {
      updateMessages("add", null, messageConsts.TEST_MESSAGE, "error");
    }
  }, []);

  return (
    <BannerWrapper >
      {messages.map((m: any) => ((
        <BannerMessage level={m.level}>
          {m.message}
          <Close onClick={() => updateMessages("delete", m.id)} />
        </BannerMessage>))
      )}
    </BannerWrapper>
  );
};

export default MessageBanner;