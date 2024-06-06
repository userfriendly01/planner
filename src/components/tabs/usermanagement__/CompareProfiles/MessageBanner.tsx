import React from "react";
import {
  BannerWrapper,
  BannerMessage
} from "usermanagement/CompareProfiles.Styles";
import { Close } from "@mui/icons-material";
import { messageConsts } from "usermanagement/messages";
import { env } from "globals";

export const MessageBanner = (props: any) => {
  const {
    messages,
    updateMessages
  } = props;

  React.useEffect(() => {
    if (env.APP_ENV === "development") {
      updateMessages("add", null, messageConsts.DEV_MESSAGE, "error");
    } else if (env.APP_ENV  === "test") {
      updateMessages("add", null, messageConsts.TEST_MESSAGE, "error");
    }
  }, []);

  return (
    <BannerWrapper >
      {messages.map((m: any) => ((
        <BannerMessage key={m.id} level={m.level}>
          {m.message}
          <Close onClick={() => updateMessages("delete", m.id)} />
        </BannerMessage>))
      )}
    </BannerWrapper>
  );
};