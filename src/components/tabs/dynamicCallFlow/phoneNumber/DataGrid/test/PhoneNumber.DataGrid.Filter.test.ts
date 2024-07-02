import {
  PhoneNumberDataGridFilter, DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY
} from "../PhoneNumber.DataGrid.Filter";
import { BrandTypeEnum } from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";

import { ReactSetState } from "../../../common/DynamicCallFlow.Interfaces";
import {
  DynamicPhoneNumberArray,
  mockDynamicPhoneNumberObject
} from "dynamicCallFlow/GraphQL/_test/Dynamic.PhoneNumber.MockData";
import { LegacyPhoneNumberArray } from "dynamicCallFlow/GraphQL/_test/Legacy.PhoneNumber.Record.MockData";
import { FieldOptions } from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import { BRAND } from "dynamicCallFlow/Form/Dynamic.PhoneNumber.Form.Fields";

jest.mock("../../Form/PhoneNumberFormFieldOptionsManager");
jest.mock("../../../common/DynamicCallFlow.Interfaces");

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