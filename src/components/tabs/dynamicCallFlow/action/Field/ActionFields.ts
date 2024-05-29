// Action Fields
export const ACTION_ID = "actionId";
export const ACTION_TYPE = "actionType";
export const CALL_FLOW_NAME = "callFlowName";
export const CREATE_TIME = "createTime";
export const UPDATE_TIME = "updateTime";

// Announcement Fields
export const SPEECH = "speech";

// Menu Fields
export const ALLOW_BARGE_IN = "allowBargeIn";
export const FINISH_ON_KEY = "finishOnKey";
export const MAX_DIGITS = "maxDigits";
export const MIN_DIGITS = "minDigits";
export const TIMEOUT = "timeout";
export const REPEAT = "repeat";
export const NEXT_ACTION_ID = "nextActionId";
export const NEXT_ACTION_TYPE = "nextActionType";

// Repeat Fields
export const CALLER_CONTEXT_ATTRIBUTES = "callerContextAttributes";
export const LOOP = "loop";

// Menu Options Fields
export const OPTIONS = "options";

// Menu Option Fields
export const DIGIT = "digit";

export const ActionFields: Array<string> = [
  ACTION_ID,
  ACTION_TYPE,
  CALL_FLOW_NAME,
  CREATE_TIME,
  UPDATE_TIME,
  SPEECH,
  ALLOW_BARGE_IN,
  FINISH_ON_KEY,
  MAX_DIGITS,
  MIN_DIGITS,
  TIMEOUT,
  REPEAT,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  CALLER_CONTEXT_ATTRIBUTES,
  LOOP,
  OPTIONS,
  DIGIT
];
Object.freeze(ActionFields);
