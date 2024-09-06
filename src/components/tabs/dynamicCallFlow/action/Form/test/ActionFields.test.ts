import {
  ACTION_ID,
  ACTION_TYPE,
  ActionFields,
  ALLOW_BARGE_IN,
  CALL_FLOW_NAME, CALLER_CONTEXT_ATTRIBUTES,
  CREATE_TIME, DIGIT,
  FINISH_ON_KEY, LOOP,
  MAX_DIGITS,
  MIN_DIGITS,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE, OPTIONS,
  REPEAT,
  SPEECH,
  TIMEOUT,
  UPDATE_TIME
} from "dynamicCallFlowAction/Form/ActionFields";

describe("ActionFields", () => {
  it("shouldContainAllActionFields", () => {
    expect(ActionFields).toEqual([
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
    ]);
  });

  it("shouldBeFrozen", () => {
    expect(Object.isFrozen(ActionFields)).toBe(true);
  });
});