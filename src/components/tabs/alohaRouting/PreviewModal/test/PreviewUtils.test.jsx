import { TableGridColumnDef } from "../TableGridColumnDef";
import { reconstructTableColumnDef } from "../previewUtils";
import { ROUTING_CACHE_MASTER_DATA } from "utils/routingUtils";

const routingDropDownData = {
  brand: ["Liberty Mutual", "Safeco"],
  channel: ["Sales", "Service"],
  dayOfWeek: ["MONDAY","TUESDAY","WEDNESDAY"],
  language: ["ENGLISH", "SPANISH"],
  policyType: ["PTYPE1", "PTYPE2"],
  priority: ["1","2","3"],
  tfnRoutingGroup: ["test","test1"]
};

export const createRoutingRule = num => {
  return {
    id: num,
    all: "ALL",
    brand: `TestBrand${num}`,
    callIntent: `TestCallIntent${num}`,
    callerState: `TestCallState${num}`,
    callerType: `TestCallType${num}`,
    channel: `TestChannel${num}`,
    dayOfWeek: "ALL",
    endTime: "12:00:00 PM",
    percentOfCallers: "10",
    pkey: "testcallintent",
    policyType: `TestPolicyType${num}`,
    skey: `TestBrand${num}_TestChannel${num}_${num}`,
    startTime: "05:00:00 PM",
    transferDestination: `1234567${num}`,
    transferMessage: `Test Transfer Message ${num}`,
    twilioSkill: `Test Twilio Skill${num}`,
    crcSkill: null
  };
};

export const createSampleTestRoutingDataList = numberOfData =>{
  const dataList = [];
  for (let num=1; num<=numberOfData; num++) {
    dataList.push(createRoutingRule(num));
  }
  return dataList;
};
const apiRef = jest.fn();

describe("PreviewUtils", () => {
  describe("reconstructTableColumnDef", () => {
    beforeEach(()=>{
      jest.clearAllMocks();
      localStorage.setItem(ROUTING_CACHE_MASTER_DATA, JSON.stringify(routingDropDownData));
    });
    afterEach(()=>{
      localStorage.removeItem(ROUTING_CACHE_MASTER_DATA);
    });

    it("should be editable", () => {
      const rows = reconstructTableColumnDef("add", [...TableGridColumnDef], apiRef);
      expect(rows[0].editable).toBeTruthy();
    });
    it("should be editable", () => {
      const rows = reconstructTableColumnDef("edit", [...TableGridColumnDef], apiRef);
      expect(rows[0].editable).toBeTruthy();
    });
    it("should NOT be editable", () => {
      const rows = reconstructTableColumnDef("delete", [...TableGridColumnDef], apiRef);
      expect(rows[0].editable).toBeFalsy();
    });
  });
});