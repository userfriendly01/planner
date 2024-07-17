import {
  PhoneNumberDataGridFilter, DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY
} from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Filter";
import { BrandTypeEnum } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

import { ReactSetState } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import {
  DynamicPhoneNumberArray,
  mockDynamicPhoneNumberObject
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberArray } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Legacy.PhoneNumber.Record.MockData";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { BRAND } from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

jest.mock("components/tabs/dynamicCallFlow/phoneNumber/Form/PhoneNumberFormFieldOptionsManager");
jest.mock("components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces");

describe("PhoneNumberDataGridFilter", () => {
  const mockSetDataGridRecords: ReactSetState<any> = jest.fn();
  const filter: PhoneNumberDataGridFilter = new PhoneNumberDataGridFilter(mockSetDataGridRecords);

  beforeEach(() => {
    filter.resetFilter();
  });

  it("shouldReturnCorrectFilterCacheKey", () => {
    expect(filter.getFilterCacheKey()).toEqual(DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY);
  });

  // it("shouldReturnCorrectPropertyValue", () => {
  //   expect(filter.getPropertyValue(MockPhoneNumberOne, "brand")).toEqual("Brand1");
  // });

  it("shouldSetAndGetSourceRecords", () => {
    const records =[...DynamicPhoneNumberArray, ...LegacyPhoneNumberArray];
    filter.sourceRecords = records;
    expect(filter["_sourceRecords"]).toEqual(records);
  });

  it("shouldSetAndGetFieldOptions", () => {
    const fieldOptions: FieldOptions = {
      callFlowNameOptions: ["Call Flow Name 1"],
      brands: ["Brand 2"]
    };
    filter.fieldOptions = fieldOptions;
    expect(filter.fieldOptions).toEqual(fieldOptions);
  });

  it("shouldResetFilter", () => {
    const filterResult = filter.resetFilter();
    expect(filterResult).toEqual({});
  });

  it("shouldAddFilterElement", () => {
    const filterResult = filter.addFilterElement("key", "value");
    expect(filterResult).toEqual({ key: "value" });
  });

  it("shouldRemoveFilterElement", () => {
    filter.addFilterElement("key", "value");
    const filterResult = filter.removeFilterElement("key");
    expect(filterResult).toEqual({});
  });

  it("shouldSaveAndGetFilter", () => {
    const filterData = { key: "value" };
    filter.saveFilter(filterData);
    const filterResult = filter.getFilter();
    expect(filterResult).toEqual(filterData);
  });

  it("shouldReturnUnfilteredWhenNoFilter", () => {
    const filterResult = filter.filterToString();
    expect(Object.keys(filter.getFilter()).length).toEqual(0);
    expect(filterResult).toEqual("Unfiltered");
  });

  it("shouldReturnFilteredWhenFilterExists", () => {
    filter.addFilterElement(BRAND, BrandTypeEnum.SAFECO);
    const filterResult = filter.filterToString();
    expect(filterResult).toEqual(`${BRAND}[${BrandTypeEnum.SAFECO}]`);
  });

  it("shouldApplyFilter", () => {
    const sourceRecords = [...DynamicPhoneNumberArray, ...LegacyPhoneNumberArray];
    sourceRecords.push(mockDynamicPhoneNumberObject({ brand: BrandTypeEnum.LIBERTY_MUTUAL }));
    filter.sourceRecords = sourceRecords;
    filter.addFilterElement(BRAND, BrandTypeEnum.LIBERTY_MUTUAL);

    const filterResults = filter.applyFilter();
    expect(filterResults.length).toEqual(1);
  });
});