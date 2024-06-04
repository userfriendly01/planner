import {
  addDynamicFlowRule as v2AddFlowRule,
  addFlowRule as v1AddFlowRule,
  batchDeleteItems as v1BatchDeleteItems,
  batchDynamicDeleteItems as v2BatchDeleteItems,
  batchDynamicFlowUpdate as v2BatchFlowUpdate,
  batchFlowCreate as v1BatchFlowCreate,
  batchFlowUpdate as v1BatchFlowUpdate,
  deleteDynamicFlowRule as v2DeleteFlowRule,
  deleteFlowRule as v1DeleteFlowRule,
  retrieveDynamicFlowData as v2RetrieveFlowData,
  retrieveFlowData as v1RetrieveFlowData,
  updateDynamicFlowDB as v2UpdateFlowDB,
  updateFlowDB as v1UpdateFlowDB
} from "services/flowTableService";

import {
  addFlowRule,
  batchDeleteItems,
  batchFlowCreate,
  batchFlowUpdate,
  deleteFlowRule,
  deleteOppositeRows,
  retrieveFlowData,
  updateFlowDB
} from "../FlowTableServiceUtil";

const token = "accessToken";
const curTime = "1971-05-25T04:00:00.000Z";
const curTimeUnixEpoch = 43992000;

jest.mock("services/flowTableService", ()=>({
  addDynamicFlowRule: jest.fn(),
  addFlowRule: jest.fn(),
  batchDeleteItems: jest.fn(),
  batchDynamicDeleteItems: jest.fn(),
  batchDynamicFlowUpdate: jest.fn(),
  batchFlowCreate: jest.fn(),
  batchFlowUpdate: jest.fn(),
  deleteDynamicFlowRule: jest.fn(),
  deleteFlowRule: jest.fn(),
  retrieveDynamicFlowData: jest.fn(),
  retrieveFlowData: jest.fn(),
  updateDynamicFlowDB: jest.fn(),
  updateFlowDB: jest.fn()
}));

describe("FlowTableServiceUtil", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(curTime));
  });
  describe("retrieveFlowData", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      v1RetrieveFlowData.mockResolvedValue({
        counter: 2,
        errors: true,
        flowData: []
      });
      v2RetrieveFlowData.mockResolvedValue({
        counter: 2,
        errors: true,
        flowData: []
      });
      v1BatchDeleteItems.mockResolvedValue({
        alertMsg: "",
        errors: [],
        failure: [],
        flag: false,
        success: []
      });
      v2BatchDeleteItems.mockResolvedValue({
        alertMsg: "",
        errors: [],
        failure: [],
        flag: false,
        success: []
      });
    });
    it("should call both retrieve functions", async () => {
      const rowInsert = jest.fn();
      const response = await retrieveFlowData(token, undefined, null, rowInsert);
      expect(v1RetrieveFlowData).toHaveBeenCalled();
      expect(v2RetrieveFlowData).toHaveBeenCalled();
      expect(response).toBe(false);
    });
    it("should call both with undefined token", async () => {
      const rowInsert = jest.fn();
      const response = await retrieveFlowData(token, undefined, undefined, rowInsert);
      expect(v1RetrieveFlowData).toHaveBeenCalled();
      expect(v2RetrieveFlowData).toHaveBeenCalled();
      expect(response).toBe(false);
    });
  });
  describe("batchFlowUpdate", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      v1BatchFlowUpdate.mockResolvedValue({
        failure: ["b"],
        success: ["a"]
      });
      v2BatchFlowUpdate.mockResolvedValue({
        failure: ["d"],
        success: ["c"]
      });
    });
    it("should call both update functions", async () => {
      const items = [ {
        id: 1
      },{
        id: 2,
        nextActionId: "1"
      }];
      const response = await batchFlowUpdate(items, token);
      expect(v1BatchFlowUpdate).toHaveBeenCalled();
      expect(v2BatchFlowUpdate).toHaveBeenCalled();
      expect(response).toStrictEqual({
        "failure": ["b", "d"],
        "success": ["a", "c"]
      });
    });
    it("should call just one function", async () => {
      const items = [ {
        id: 1
      },{
        id: 2
      }];
      const response = await batchFlowUpdate(items, token);
      expect(v1BatchFlowUpdate).toHaveBeenCalled();
      expect(v2BatchFlowUpdate).not.toHaveBeenCalled();
      expect(response).toStrictEqual({
        "failure": ["b"],
        "success": ["a"]
      });
    });
  });
  describe("batchDeleteItems", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      v1BatchDeleteItems.mockResolvedValue({
        failure: ["b"],
        success: ["a"]
      });
      v2BatchDeleteItems.mockResolvedValue({
        alertMsg: "OK",
        failure: ["d"],
        success: ["c"]
      });
    });
    it("should not call both delete functions", async () => {
      const items = [ {
        id: 1
      }];
      await batchDeleteItems(items, token);
      expect(v1BatchDeleteItems).toHaveBeenCalled();
      expect(v2BatchDeleteItems).not.toHaveBeenCalled();
    });
  });
  describe("batchFlowCreate", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      v1BatchFlowCreate.mockResolvedValue({
        alertMsg: "",
        failure: ["b"],
        flag: false,
        success: ["a"]
      });
      v2BatchFlowUpdate.mockResolvedValue({
        alertMsg: "",
        failure: ["d"],
        flag: false,
        success: ["c"]
      });
    });
    it("should call both create functions", async () => {
      const items = [ {
        id: 1
      },{
        id: 2,
        nextActionId: "1"
      }];
      await batchFlowCreate(items, token);
      expect(v1BatchFlowCreate).toHaveBeenCalled();
      expect(v2BatchFlowUpdate).toHaveBeenCalled();
    });
    it("should call just one function", async () => {
      const items = [ {
        id: 1
      },{
        id: 2
      }];
      await batchFlowCreate(items, token);
      expect(v1BatchFlowCreate).toHaveBeenCalled();
      expect(v2BatchFlowUpdate).not.toHaveBeenCalled();
    });
  });
  describe("addFlowRule", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      v1AddFlowRule.mockResolvedValue({
        alertMsg: "",
        failure: ["b"],
        flag: false,
        success: ["a"]
      });
      v2AddFlowRule.mockResolvedValue({
        alertMsg: "",
        failure: ["d"],
        flag: false,
        success: ["c"]
      });
    });
    it("should call dynamic function", async () => {
      const item = {
        id: 1,
        nextActionId: {
          value: "LSCMainMenu"
        }
      };
      const dataRequests = ["Classify"];
      await addFlowRule(item, token, curTime, dataRequests);
      expect(v1AddFlowRule).not.toHaveBeenCalled();
      expect(v2AddFlowRule).toHaveBeenCalled();
    });
    it("should call nondynamic function", async () => {
      const item = {
        id: 1
      };
      const dataRequests = ["Classify"];
      await addFlowRule(item, token, curTime, dataRequests);
      expect(v1AddFlowRule).toHaveBeenCalled();
      expect(v2AddFlowRule).not.toHaveBeenCalled();
    });
    describe("using defaults", () => {
      it("should call dynamic function", async () => {
        const item = {
          id: 1,
          nextActionId: {
            value: "LSCMainMenu"
          }
        };
        await addFlowRule(item, token);
        expect(v2AddFlowRule).toHaveBeenCalledWith(item, token, curTimeUnixEpoch, []);
      });

    });
  });
  describe("updateFlowDB", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it("should call dynamic function", async () => {
      const item = {
        id: 1,
        nextActionId: "LSCMainMenu"
      };
      await updateFlowDB(item, token);
      expect(v1UpdateFlowDB).not.toHaveBeenCalled();
      expect(v2UpdateFlowDB).toHaveBeenCalled();
    });
    it("should call nondynamic function", async () => {
      const item = {
        id: 1
      };
      await updateFlowDB(item, token);
      expect(v1UpdateFlowDB).toHaveBeenCalled();
      expect(v2UpdateFlowDB).not.toHaveBeenCalled();
    });
  });
  describe("deleteFlowRule", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it("should call dynamic function", async () => {
      const item = {
        id: 1,
        nextActionId: "LSCMainMenu"
      };
      await deleteFlowRule(item, token);
      expect(v1DeleteFlowRule).not.toHaveBeenCalled();
      expect(v2DeleteFlowRule).toHaveBeenCalled();
    });
    it("should call nondynamic function", async () => {
      const item = {
        id: 1
      };
      await deleteFlowRule(item, token);
      expect(v1DeleteFlowRule).toHaveBeenCalled();
      expect(v2DeleteFlowRule).not.toHaveBeenCalled();
    });
  });
  describe("deleteOppositeRows", () => {
    it("will delete from both sources", async () => {
      const dynamicRecord = {
        id: "1",
        nextActionId: "123"
      };
      const nonDynamicRecord = {
        id: "2"
      };

      await deleteOppositeRows([dynamicRecord, nonDynamicRecord], token);

      expect(v1BatchDeleteItems).toHaveBeenCalled();
      expect(v2BatchDeleteItems).toHaveBeenCalled();
    });
  });
});