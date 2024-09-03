import { testLegacyPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/test/PhoneNumber.Xlsx.MockData.Legacy.Row";
import { deepCopyObject } from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import {
  PhoneNumberXlsxImportLegacyValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Legacy.Validator";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";

describe("Phone Number XLSX Value Inspector", () => {
  const validator: PhoneNumberXlsxImportValidator = new PhoneNumberXlsxImportLegacyValidator();

  describe("Happy path", () => {
    describe("Legacy", () => {
      it("should return an empty array of errors when all values are valid", () => {
        const legacyPhoneNumberXlsxValueInspectorCopy = deepCopyObject(testLegacyPhoneNumberXlsxRow);
        const errors = validator.validate([legacyPhoneNumberXlsxValueInspectorCopy]);

        expect(errors).toStrictEqual([]);
      });
    });
  });

});
