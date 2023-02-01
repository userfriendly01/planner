
export interface Field {
  field: string,
  name: string,
  type: string,
  description: string,
  example: any,
  options: null | ((state?: any) => any[]),
  validateFunction: (row: any, rowNumber: number, state?: any) => Promise<string>
}

export interface Fields {
  [key: string]: Field
}


export interface Row {
  [key: string]: any
}

export interface MultiRunDependency {
  name: string,
  variable: any
}

export interface Template {
  name: string,
  data?: { [key: string]: any }
  processFunction: (row: Row, rowNumber: number, template?: Template) => Promise<string>,
  multiRunDependencies: MultiRunDependency[] | null,
  validationConcurrencyLimit: number,
  processingConcurrencyLimit: number,
  fields: Field[]
}

export interface Templates {
  [key: string]: Template
}

export interface BulkCreateFormProps {
  selectedTemplates: Template[],
  setSelectedTemplates: () => 
}

export const views: any = {
  BULK_CREATE_USERS: {
    value: "BULK_CREATE_USERS",
    label: "Create Users"
  },
  BULK_UPDATE: {
    value: "BULK_UPDATE",
    label: "Bulk Update"
  }
};

export const updateActions: any = {
  WORKER_ATTRIBUTES: {
    value: "WORKER_ATTRIBUTES",
    label: "Twilio Worker Attributes"
  }
};

export const valueTypes: any = {
  STRING: {
    value: "string",
    label: "String"
  },
  NUMBER: {
    value: "number",
    label: "Number"
  },
  BOOLEAN: {
    value: "boolean",
    label: "Boolean"
  },
  OBJECT: {
    value: "object",
    label: "Object"
  },
  ARRAY: {
    value: "array",
    label: "Array"
  }
};

export enum ErrorTypes {
  NO_ERRORS = "No Errors",
  VALIDATION = "Validation",
  PROCESSING = "Processing"
}

export enum LoadingStatus {
  LOADING = "loading",
  FAILED = "failed",
  SUCCESS = "success"
}