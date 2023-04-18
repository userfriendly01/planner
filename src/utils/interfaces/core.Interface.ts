export interface AlertBarProps {
    open: boolean;
    msg: string;
    severityType: string;
}

export interface FormValidationProps {
    error?: boolean;
    value?: any;
    required?: boolean;
}

export interface FormValidationRule {
    [key: string]: FormValidationProps;
}