import { deepCopyObject } from "components/tabs/dynamicCallFlow/test/dynamicCallFlow.Testing.Util";
import { PhoneNumberXlsxValueInspector } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Value.Inspector";
import { testDynamicPhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/Dynamic.PhoneNumber.Xlsx.MockData";
import { testLegacyPhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/Legacy.PhoneNumber.Xlsx.MockData";

describe("Phone Number XLSX Value Inspector", () => {
  describe("inspectValues", () => {
    describe("Dynamic happy path", () => {
      it("should return an empty array of errors", () => {
        const phoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
        const dynamicPhoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
        const errors = phoneNumberXlsxValueInspector.inspectValues([dynamicPhoneNumberXlsxRowCopy]);

        expect(errors).toEqual([]);
      });
    });

    describe("Legacy happy path", () => {
      it("should return an empty array of errors", () => {
        const phoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
        const legacyPhoneNumberXlsxValueInspectorCopy = deepCopyObject(testLegacyPhoneNumberXlsxRow);
        const errors = phoneNumberXlsxValueInspector.inspectValues([legacyPhoneNumberXlsxValueInspectorCopy]);

        expect(errors).toEqual([]);
      });
    });

    describe("Error path", () => {
      it("should return an array of errors when dialedPhoneNumber is missing", () => {
        const phoneNumberXlsxValueInspector = new PhoneNumberXlsxValueInspector();
        const phoneNumberXlsxRowCopy = deepCopyObject(testDynamicPhoneNumberXlsxRow);
        phoneNumberXlsxRowCopy.dialedPhoneNumber = "";
        const errors = phoneNumberXlsxValueInspector.inspectValues([phoneNumberXlsxRowCopy]);

        expect(errors).toEqual(["Dialed Phone Number[] missing dialedPhoneNumber."]);
      });
    });
  });
});
