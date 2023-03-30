
export interface Field {
  field: string,
  name: string,
  type: string,
  description: string,
  example: any,
  options: null | ((state?: any, businessUnit?: string) => any[]),
  validateFunction: (row: any, state?: any) => Promise<string>
}

export interface Fields {
  [key: string]: Field
}

export interface Row {
  [key: string]: any
}

export interface UploadedRow {
  "__rowNum__": string,
  [key: string]: any
}

export interface MultiRunDependency {
  name: string,
  variable: any
}

export interface Template {
  name: string,
  data?: { [key: string]: any }
  processFunction: (row: Row, template?: Template) => Promise<string>,
  stateUpdateFunctions: ((dispatch: any) => Promise<void>)[],
  multiRunDependencies: MultiRunDependency[] | null,
  validationConcurrencyLimit: number,
  processingConcurrencyLimit: number,
  fields: Field[],
  [key: string]: any
}


export interface Templates {
  [key: string]: Template
}

export interface BulkActionFormProps {
  selectedTemplates: Template[],
  setSelectedTemplates: (template: Template[]) => void;
}

export interface BulkUpdateProps {
  template: Template,
  selectedTemplates: Template[],
  replaceTemplate: (template: Template) => void;
  updateTemplate: (template: Template, data: any) => void;
  removeTemplate: (template: Template) => void;
}

export enum PROCESSING_STATES {
  VALIDATING = "validating",
  VALIDATED = "validated",
  PROCESSING = "processing",
  PROCESSED = "processed"
}

export interface ProcessingModalProps {
  selectedTemplates: Template[],
  handleClose: () => void;
  consolidatedFieldsList: Field[],
  uploadedForm: any[]
}

export interface BusinessUnitModalProps {
  handleClose: () => void;
  handleExport: (wfmBU: string | null) => void
}
export interface WorkerAttribute {
  label: string,
  value: string,
  type: string,
  validator?: () => boolean;
  location: null | string
}

export interface WorkerAttributes {
  [key: string] : WorkerAttribute
}

export interface View {
  [key: string] : {
    value: string,
    label: string
  }
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