import { listPhoneNumberRecords } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/List.PhoneNumber.Records.Util";
import { listDynamicPhoneNumberRecords } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Dynamic.PhoneNumber.Records.Query";
import { listLegacyPhoneNumberRecords } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Legacy.PhoneNumber.Records.Query";
import { mockAccessToken } from "dynamicCallFlowPhoneNumber/GraphQL/Query/test/GraphQL.Query.Testing.Util";
import { mockDynamicPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberArray } from "dynamicCallFlowPhoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Dynamic.PhoneNumber.Records.Query", () => ({
  listDynamicPhoneNumberRecords: jest.fn()
}));

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Query/List.Legacy.PhoneNumber.Records.Query", () => ({
  listLegacyPhoneNumberRecords: jest.fn()
}));

describe("listPhoneNumberRecords", () => {
  it("should list both dynamic and legacy phone number records successfully", async () => {
    (listDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue(mockDynamicPhoneNumberArray());
    (listLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue(LegacyPhoneNumberArray);
    const result = await listPhoneNumberRecords(mockAccessToken);
    expect(result.length).toEqual(mockDynamicPhoneNumberArray().length + LegacyPhoneNumberArray.length);
  });

  it("should handle when both dynamic and legacy phone number records return nothing", async () => {
    (listDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue([]);
    (listLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue([]);
    const result = await listPhoneNumberRecords(mockAccessToken);
    expect(result.length).toEqual(0);
  });

  it("should handle when listing legacy phone number records return nothing", async () => {
    (listDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue(mockDynamicPhoneNumberArray());
    (listLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue([]);
    const result = await listPhoneNumberRecords(mockAccessToken);
    expect(result.length).toEqual(mockDynamicPhoneNumberArray().length);
  });

  it("should handle when listing dynamic phone number records return nothing", async () => {
    (listDynamicPhoneNumberRecords as jest.Mock).mockResolvedValue([]);
    (listLegacyPhoneNumberRecords as jest.Mock).mockResolvedValue(LegacyPhoneNumberArray);
    const result = await listPhoneNumberRecords(mockAccessToken);
    expect(result.length).toEqual(mockDynamicPhoneNumberArray().length);
  });
});