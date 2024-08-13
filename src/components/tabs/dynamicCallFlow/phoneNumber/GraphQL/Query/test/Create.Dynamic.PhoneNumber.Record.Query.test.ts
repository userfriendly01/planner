import {
  CreateDynamicPhoneNumberRecordQuery
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Create.Dynamic.PhoneNumber.Record.Query";

const accessToken = "testAccessToken";

describe("CreateDynamicPhoneNumberRecordQuery", () => {
  let query: CreateDynamicPhoneNumberRecordQuery;

  beforeAll(() => {
    query = new CreateDynamicPhoneNumberRecordQuery();
  });

  it("shouldReturnCorrectQueryName", () => {
    expect(query.queryName()).toBe("createPhoneNumber");
  });

  it("shouldReturnCorrectQueryDefinition", () => {
    const expectedDefinition = `
      mutation createPhoneNumber ($input: PhoneNumberInput! ){
        createPhoneNumber(input: $input) {
          phoneNumber
          phoneNumberType
        }
      }`;
    expect(query.queryDefinition().replace(/\s+/g, " ")).toBe(expectedDefinition.replace(/\s+/g, " "));
  });

// describe("createDynamicPhoneNumberRecord", () => {
//   it("shouldCreatePhoneNumberRecordSuccessfully", async () => {
//     const spyOnCreate = jest.spyOn(CreateDynamicPhoneNumberRecordQuery.prototype, "create");
//     const mockCreate = jest.spyOn(CreateDynamicPhoneNumberRecordQuery.prototype, "create").mockResolvedValue({
//       record: {
//         phoneNumber: "1234567890",
//         phoneNumberType: "Mobile"
//       }
//     });
//     const result = await createDynamicPhoneNumberRecord(accessToken, DynamicPhoneNumberOne);
//     expect(result).toEqual({
//       record: {
//         phoneNumber: "1234567890",
//         phoneNumberType: "Mobile"
//       }
//     });
//     mockCreate.mockRestore();
//   });
//
//   it("shouldHandleEmptyDataRequests", async () => {
//     const mockCreate = jest.spyOn(CreateDynamicPhoneNumberRecordQuery.prototype, "create").mockResolvedValue({
//       record: {
//         phoneNumber: "1234567890",
//         phoneNumberType: "Mobile"
//       }
//     });
//     const result = await createDynamicPhoneNumberRecord(accessToken, DynamicPhoneNumberOne, []);
//     expect(result).toEqual({
//       record: {
//         phoneNumber: "1234567890",
//         phoneNumberType: "Mobile"
//       }
//     });
//     mockCreate.mockRestore();
//   });
//
//   it("shouldSetCreateTimeAndUpdateTime", async () => {
//     const mockCreate = jest.spyOn(CreateDynamicPhoneNumberRecordQuery.prototype, "create").mockResolvedValue({
//       record: {
//         phoneNumber: "1234567890",
//         phoneNumberType: "Mobile"
//       }
//     });
//     const accessToken = "testAccessToken";
//     const phoneNumberRecord = {
//       phoneNumber: "1234567890",
//       phoneNumberType: "Mobile"
//     };
//     const result = await createDynamicPhoneNumberRecord(accessToken, phoneNumberRecord);
//     expect(phoneNumberRecord.createTime).toBeDefined();
//     expect(phoneNumberRecord.updateTime).toBeDefined();
//     mockCreate.mockRestore();
//   });
});