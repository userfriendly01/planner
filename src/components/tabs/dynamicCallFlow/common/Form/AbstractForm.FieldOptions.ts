export interface FieldOptionsManager<T> {
  get(key: string): FieldOptionsType;

  generate(records: Array<T>): void;
}

export type FieldOptionsType = Array<string>;

export interface FieldOptions {
  [key: string]: FieldOptionsType;
}

export abstract class AbstractFormFieldOptions<RecordType> implements FieldOptionsManager<RecordType> {
  protected abstract getRecordKeyValue(record: RecordType, key: string): string | Array<string> | undefined;

  get(key: string): FieldOptionsType {
    const fieldOptions = JSON.parse(localStorage.getItem(this.getFieldOptionsCacheKey()) || "{}");
    return fieldOptions[key] ? fieldOptions[key] : [];
  }

  protected abstract getFieldOptionsCacheKey(): string;

  private getFieldOptionsCacheKeyLastCachedDate(): string {
    return this.getFieldOptionsCacheKey().concat("_lastCachedDate");
  }

  protected abstract getDataDrivenOptionsFieldNames(): Array<string>;

  protected abstract getDataDrivenOptionsFieldNamesWithList(): Array<string>;

  protected abstract getStaticFieldOptions(): FieldOptions;

  generate(records: Array<RecordType>): void {
    const formFieldOptions = this.getStaticFieldOptions();

    records.forEach((record: RecordType) => this.getDataDrivenOptionsFieldNames().forEach((key: string) => {
      const propertyValue = this.getRecordKeyValue(record, key);
      if (!formFieldOptions[key]) {
        formFieldOptions[key] = [];
      }

      if (propertyValue) {
        if (this.getDataDrivenOptionsFieldNamesWithList().includes(key)) {
          if (Array.isArray(propertyValue)) {
            (propertyValue as Array<string>).forEach(arrayElement => {
              if (arrayElement && arrayElement.trim().length > 0 && arrayElement.toLowerCase() !== "null") {
                formFieldOptions[key].push(arrayElement);
              }
            });
          } else {
            console.log("Invalid data type for field: ", key, " in record: ", record, "expected type to be Array<string> but got: ", typeof (propertyValue));
          }
        } else if (typeof propertyValue === "string" && propertyValue.trim().length > 0 && propertyValue.toLowerCase() !== "null") {
          formFieldOptions[key].push(propertyValue as string);
        } else {
          console.log("Invalid data type for field: ", key, " in record: ", record, "expected type to be string but got: ", typeof (propertyValue));
        }
      }
    }));

    Object.keys(formFieldOptions).forEach(key => formFieldOptions[key] = [...new Set(formFieldOptions[key])].sort());

    localStorage.setItem(this.getFieldOptionsCacheKey(), JSON.stringify(formFieldOptions));
    localStorage.setItem(this.getFieldOptionsCacheKeyLastCachedDate(), new Date().toString());
  }
}