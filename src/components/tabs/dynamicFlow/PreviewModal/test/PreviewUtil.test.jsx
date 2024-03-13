import { TableGridColumnDef } from "../TableColumnDef";
import {
  reconstructTableColumnDef
} from "../PreviewUtil";

export const createFlowDataItem = num => {
  return {
    actionId: `LSC1GREETING${num}`,
    actionType: `ANNOUNCEMENT${num}`,
    allowBargeIn: false,
    callFlowName: `LSC${num}`,
    errors: `* no errors${num}`,
    finishOnKey: `#${num}`,
    maxDigits: `3${num}`,
    minDigits: `1${num}`,
    nextActionId: `LSC1MENU${num}`,
    nextActionType: `MENU${num}`,
    options: [{
      callerContextAttributes: {
        reasonForReturning: `transfer${num}`
      },
      digit: `1${num}`,
      nextActionType: `TRANSFER${num}`
    }, {
      digit: `other${num}`,
      nextActionId: `LSC1INVALID${num}`,
      nextActionType: `ANNOUNCEMENT${num}`
    }],
    repeat: {
      callerContextAttributes: {
        reasonForReturning: `hangup${num}`
      }
    },
    speech: `Hello there!${num}`,
    timeout: `23${num}`
  };
};

export const createFlowDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    dataList.push(createFlowDataItem(num));
  }
  return dataList;
};


const apiRef = jest.fn();

describe("PreviewUtils", () => {
  describe("reconstructTableColumnDef", () => {
    describe("add", () => {
      const reconstructed = reconstructTableColumnDef([...TableGridColumnDef],apiRef);
      it("should be editable", () => {
        expect(reconstructed[0].editable).toEqual(true);
      });
    });
  });
});
