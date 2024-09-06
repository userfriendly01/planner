import {
  FieldConfigs, FieldDataType
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { logger } from "utils/logger";

export interface FormFieldOptions<RecordType> {
  generateOptions(records: Array<RecordType>): void;
  updateFieldOptionsOnFieldConfigs(fieldConfigs: FieldConfigs): FieldConfigs;
}

export interface FieldOptions {
  [key: string]: Array<string>;
}

export abstract class AbstractFormFieldOptionsManager<RecordType> implements FormFieldOptions<RecordType> {
  private readonly _fieldOptions: FieldOptions = {};

  constructor() {
    const fieldOptionsCache = localStorage.getItem(this.getFieldOptionsCacheKey());
    const lastCachedDate = localStorage.getItem(this.getFieldOptionsCacheKeyLastCachedDate());

    this._fieldOptions = this.getStaticFieldOptions();
    if (fieldOptionsCache && lastCachedDate) {
      this._fieldOptions = {
        ...JSON.parse(fieldOptionsCache),
        ...this._fieldOptions
      };
    }
  }

  abstract getRecordPropertyValue(record: RecordType, key: string): FieldDataType;

  abstract getFieldOptionsCacheKey(): string;

  private getFieldOptionsCacheKeyLastCachedDate(): string {
    return this.getFieldOptionsCacheKey().concat("_lastCachedDate");
  }

  abstract getDataDrivenOptionsFieldNames(): Array<string>;

  abstract getDataDrivenOptionsFieldNamesWithList(): Array<string>;

  abstract getStaticFieldOptions(): FieldOptions;

  private isValidOption(key: string, option: string): boolean {
    return typeof option === "string" && option.trim().length > 0 && option.toLowerCase() !== "null" && !this._fieldOptions[key].includes(option);
  }

  generateOptions(records: Array<RecordType>): FieldOptions {
    records?.forEach((record: RecordType) => this.getDataDrivenOptionsFieldNames().forEach((key: string) => {
      const recordPropertyValue = this.getRecordPropertyValue(record, key);

      if (!this._fieldOptions[key]) {
        this._fieldOptions[key] = [];
      }

      if (recordPropertyValue) {
        if (this.getDataDrivenOptionsFieldNamesWithList().includes(key)) {
          if (Array.isArray(recordPropertyValue)) {
            (recordPropertyValue as Array<string>).forEach(option => {
              if (this.isValidOption(key, option)) {
                this._fieldOptions[key].push(option);
              }
            });
          } else {
            const message = `Invalid data type for field: ${key}  in record: ${record} expected type to be Array<string> but got: ${typeof (recordPropertyValue)}`;
            logger.log(message, {});
          }
        } else if (this.isValidOption(key, recordPropertyValue as string)) {
          this._fieldOptions[key].push(recordPropertyValue as string);
        }
      }
    }));

    Object.keys(this._fieldOptions).forEach(key => {
      if (this._fieldOptions[key].length === 0) {
        logger.warn("No options found for field: ", { key });
      }
      this._fieldOptions[key] = [...new Set(this._fieldOptions[key])].sort();
    });

    localStorage.setItem(this.getFieldOptionsCacheKey(), JSON.stringify(this._fieldOptions));
    localStorage.setItem(this.getFieldOptionsCacheKeyLastCachedDate(), new Date().toString());

    return this._fieldOptions;
  }

  updateFieldOptionsOnFieldConfigs(fieldConfigs: FieldConfigs): FieldConfigs {
    Object.keys(this._fieldOptions).forEach(fieldOptionKey => {
      if (fieldConfigs[fieldOptionKey]) {
        fieldConfigs[fieldOptionKey].options = this._fieldOptions[fieldOptionKey];
      }
    });

    return fieldConfigs;
  }
}