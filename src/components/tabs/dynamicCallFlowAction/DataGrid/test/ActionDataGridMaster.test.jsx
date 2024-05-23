
import { getDynamicGridMasterData } from "../ActionDataGridMaster";

let masterData;

describe("<DynamicGridMaster />", () => {
  it("stores call flow data and returns it", () => {
    masterData = getDynamicGridMasterData([{ actionId: ["actionId-123"]}]);
    expect(masterData).toEqual({
      "actionId": [],
      "actionType": [],
      "callFlowName": [],
      "createTime": [],
      "finishOnKey": [],
      "maxDigits": [],
      "minDigits": [],
      "nextActionId": [],
      "nextActionType": [],
      "options": [],
      "repeat": [],
      "speech": [],
      "timeout": [],
      "updateTime": []
    });
  });
  it("ignores foo and does not return it", () => {
    masterData = getDynamicGridMasterData([{ foo: "bar" }]);
    expect(masterData.foo).toEqual(undefined);
  });
  it("handles error and returns nothing", () => {
    const masterData2 = getDynamicGridMasterData("this is an unexpected data format");
    expect(masterData2).toEqual({});  //or empty object, if this test runs first, async
  });
  it("handles null and returns 'cleared' masterData", () => {
    const masterData2 = getDynamicGridMasterData([null]);
    expect(masterData2).toEqual({
      "actionId": [],
      "actionType": [],
      "callFlowName": [],
      "createTime": [],
      "finishOnKey": [],
      "maxDigits": [],
      "minDigits": [],
      "nextActionId": [],
      "nextActionType": [],
      "options": [],
      "repeat": [],
      "speech": [],
      "timeout": [],
      "updateTime": []
    });
  });



});
