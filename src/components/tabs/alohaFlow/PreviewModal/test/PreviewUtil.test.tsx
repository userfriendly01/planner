import { CctSharedCallFlowDb } from "../..";
import { TableGridColumnDef } from "../TableColumnDef";
import {
  reconstructTableColumnDef
} from "../PreviewUtil";
import { PreviewModalAction } from "../../AlohaFlow.Interfaces";
import { FLOW_MASTER_DATA } from "utils";

export const createFlowDataItem = (num: number): CctSharedCallFlowDb => {
  return {
    id: num,
    pkey: `+18005551212x${num}`,
    agentId: `agent${num}`,
    brand: `brand${num}`,
    callFlowTemplate: `cft${num}`,
    channel: `channel${num}`,
    content: {
      callerType: "Customer",
      callFlowRoute: `route A${num}`,
      dataRequests: ["Classify"],
      greetingMessages: "Hello and welcome!",
      transferNumber: `+12223334444x${num}`
    },
    createTime: "2020-01-01T15:14:13.${num}Z",
    dialedDescription: `Test case ${num}`,
    employeeId: `n${num}`,
    userDestination: "Avaya"
  };
};

export const createFlowDataList = (numberOfData: number): Array<CctSharedCallFlowDb> =>{
  const dataList: Array<CctSharedCallFlowDb> = [];
  for (let num=1; num<=numberOfData; num++) {
    dataList.push(createFlowDataItem(num));
  }
  return dataList;
};
export const flowDropDownData = {
  brand: ["Liberty Mutual", "Safeco"],
  channel: ["Sales", "Service"],
  languageOffer: ["ENGLISH", "SPANISH"],
  userDestination: ["TEST_DEST_1","TEST_DEST_2"],
  callFlowRoute: ["CFR1","CFR2","CFR3"],
  callerType: ["CT1","CT2","CT3"],
  dataRequests: ["DR1","DR2","DR3"],
  type: ["DID", "DRC", "CRC"],
  tfnRoutingGroup:["Group1","Group2","Group3"]
};

localStorage.setItem(FLOW_MASTER_DATA, JSON.stringify(flowDropDownData));

describe("PreviewUtils", () => {
  describe("reconstructTableColumnDef", () => {
    describe("edit", () => {
      const action:  PreviewModalAction = "edit";
      const reconstructed = reconstructTableColumnDef(action, [...TableGridColumnDef]);
      it("should be editable", () => {
        expect(reconstructed[0].editable).toEqual(true);
      });
    });
    describe("add", () => {
      const action:  PreviewModalAction = "add";
      const reconstructed = reconstructTableColumnDef(action, [...TableGridColumnDef]);
      it("should be editable", () => {
        expect(reconstructed[0].editable).toEqual(true);
      });
    });
    describe("delete", () => {
      const action:  PreviewModalAction = "delete";
      const reconstructed = reconstructTableColumnDef(action, [...TableGridColumnDef]);
      it("should be editable", () => {
        expect(reconstructed[0].editable).toBeFalsy();
      });
    });
  });
});
