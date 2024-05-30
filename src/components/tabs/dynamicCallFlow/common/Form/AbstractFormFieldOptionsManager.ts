import { FieldConfigs } from "./Form.FieldConfig.State";

export interface FormFieldOptions<RecordType> {
  generate(records: Array<RecordType>): void;
  register(key: string, fieldConfigs: FieldConfigs): void;
}

export interface FieldOptions {
  [key: string]: Array<string>;
}

export abstract class AbstractFormFieldOptionsManager<RecordType> implements FormFieldOptions<RecordType> {
  private _fieldOptions: FieldOptions = {};
  private _registeredFieldConfigs: Map<string, FieldConfigs> = new Map<string, FieldConfigs>();

  constructor(fieldOptions: FieldOptions) {
    this._fieldOptions = fieldOptions;
  }

  protected abstract getRecordKeyValue(record: RecordType, key: string): string | Array<string> | undefined;

  protected abstract getFieldOptionsCacheKey(): string;

  private getFieldOptionsCacheKeyLastCachedDate(): string {
    return this.getFieldOptionsCacheKey().concat("_lastCachedDate");
  }

  protected abstract getDataDrivenOptionsFieldNames(): Array<string>;

  protected abstract getDataDrivenOptionsFieldNamesWithList(): Array<string>;

  protected abstract getStaticFieldOptions(): FieldOptions;

  register(key: string, fieldConfigs: FieldConfigs): void {
    this._registeredFieldConfigs.set(key, fieldConfigs);
  }

  generate(records: Array<RecordType>): void {
    records.forEach((record: RecordType) => this.getDataDrivenOptionsFieldNames().forEach((key: string) => {
      const recordPropertyValue = this.getRecordKeyValue(record, key);

      if (!this._fieldOptions[key]) {
        this._fieldOptions[key] = [];
      }

      if (recordPropertyValue) {
        if (this.getDataDrivenOptionsFieldNamesWithList().includes(key)) {
          if (Array.isArray(recordPropertyValue)) {
            (recordPropertyValue as Array<string>).forEach(option => {
              if (typeof option === "string" && option.trim().length > 0 && option.toLowerCase() !== "null") {
                this._fieldOptions[key].push(option);
              }
            });
          } else {
            console.log("Invalid data type for field: ", key, " in record: ", record, "expected type to be Array<string> but got: ", typeof (recordPropertyValue));
          }
        } else if (typeof recordPropertyValue === "string" && recordPropertyValue.trim().length > 0 && recordPropertyValue.toLowerCase() !== "null") {
          this._fieldOptions[key].push(recordPropertyValue as string);
        } else {
          console.log("Invalid data type for field: ", key, " in record: ", record, "expected type to be string but got: ", typeof (recordPropertyValue));
        }
      }
    }));

    Object.keys(this._fieldOptions).forEach(key => this._fieldOptions[key] = [...new Set(this._fieldOptions[key])].sort());

    localStorage.setItem(this.getFieldOptionsCacheKey(), JSON.stringify(this._fieldOptions));
    localStorage.setItem(this.getFieldOptionsCacheKeyLastCachedDate(), new Date().toString());

    this.updateFieldOptionsOnRegisteredFieldConfigs(this._fieldOptions);
  }

  private updateFieldOptionsOnRegisteredFieldConfigs(_fieldOptions: FieldOptions) {
    Object.values(this._registeredFieldConfigs).forEach((fieldConfigs: FieldConfigs) => {
      Object.keys(_fieldOptions).forEach(fieldOptionKey => {
        fieldConfigs[fieldOptionKey].options = this._fieldOptions[fieldOptionKey];
      });
    });
  }
}