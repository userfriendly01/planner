import { TwilioConsoleUser } from "components/tabs/usermanagement/TwilioConsoleUsersView/interfaces";
import { apiPaths } from "globals/index";
import { myAxios } from "utils/myAxios";

export const getTwilioConsoleUsers = async (accessToken: string): Promise<TwilioConsoleUser[]> => {
  const { data } = await myAxios.get<TwilioConsoleUser[]>(apiPaths.GET_TWILIO_CONSOLE_USERS, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return data;
};
