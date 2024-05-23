
// export type AlertBarAction = ReactStateAction<AlertBarProps>;

export type AlertSeverityType = "success" | "info" | "warning" | "error";

export enum AlertSeverityTypeEnum {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error"
}

export interface AlertBarProps {
  open: boolean;
  msg: string;
  severityType: AlertSeverityType;
  duration?: number
}

// export type AlertBarSetStateType = React.Dispatch<React.SetStateAction<AlertBarProps>>;