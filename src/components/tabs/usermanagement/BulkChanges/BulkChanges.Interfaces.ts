
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