import {
  AppState, GenericObject
} from "globals/interfaces";

interface Field {
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

export interface UploadedRow {
  "__rowNum__": string,
  [key: string]: any
}

interface MultiRunDependency {
  name: string,
  variable: any
}

export interface Template {
  name: string,
  data?: { [key: string]: any }
  processFunction: (row: GenericObject, template?: Template) => Promise<string>,
  stateUpdateFunctions: ((state: AppState, dispatch: any, successfulRows?: any, selectedTemplates?: any) => Promise<any>)[],
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
  businessUnitId?: string,
  setBusinessUnitId?: (id: string) => void,
  selectedTemplates: Template[],
  setSelectedTemplates: (template: Template[]) => void;
  setShowTemplates?: (show: boolean) => void;
  setUploadedForm?: (show: any[]) => void;
}

export interface BulkUpdateProps {
  template: Template,
  selectedTemplates: Template[],
  setUploadedForm?: (show: any[]) => void;
  setShowTemplates?: (show: boolean) => void;
  replaceTemplate: (template: Template) => void;
  updateTemplate: (template: Template, data: any) => void;
  removeTemplate: (template: Template) => void;
}

export interface BulkCallerStatesProps {
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
  handleConfirm: (wfmBU: string | null) => void
}
export interface WorkerAttribute {
  label: string,
  value: string,
  type: string,
  validator?: () => boolean;
  location: null | string
}

export interface WorkerAttributes {
  [key: string]: WorkerAttribute
}

export interface View {
  [key: string]: {
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
  },
  BULK_ADD_MANAGER: {
    value: "BULK_ADD_MANAGER",
    label: "Create Managers"
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