import { apiPaths } from "globals";
import { AxiosResponse } from "axios";
import { escapeQuotes } from "utils";
import { myAxios } from "utils/myAxios";

export const getTfn = (e164Tfn: number, token: string): Promise<AxiosResponse<any>> => {
  return myAxios.get(`${apiPaths.TFN_DATA}/${e164Tfn}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateTfn = (e164Tfn: number, tfnState: any, nNumber: string, token: string): Promise<AxiosResponse<any>> => {
  const payload = {
    phone_number: e164Tfn,
    callflow_id: tfnState.group.callflowId.toString(),
    voice_webhook_url: tfnState.group.voiceWebhookUrl,
    entry_msg: escapeQuotes(tfnState.entryMessage),
    display_nme: escapeQuotes(tfnState.displayName),
    default_skill: tfnState.group.defaultSkill,
    row_updt_by: nNumber
  };

  return myAxios.post(`${apiPaths.TFN_DATA}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};