import { AlertColor } from "@mui/material";

export interface AlertBarProps {
    open: boolean;
    msg: string;
    severityType: AlertColor;
    duration?: number
}

export interface FormValidationProps {
    error?: boolean;
    value?: any;
    required?: boolean;
}

export interface FormValidationRule {
    [key: string]: FormValidationProps;
}