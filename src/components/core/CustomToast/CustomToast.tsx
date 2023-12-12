import * as React from "react";
import {
  Stack,Snackbar
}from "@mui/material";
import MuiAlert, {
  AlertProps,
  AlertColor
} from "@mui/material/Alert";
import {
  useEffect,
  useState
} from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface CustomToastProps {
  open: boolean,
  onClose: any,
  msg: string,
  severityType: AlertColor,
  duration?: number
}

export default ({
  open,
  onClose,
  msg,
  severityType,
  duration
}: CustomToastProps): JSX.Element => {
  const [alertFlag, setAlertFlag] = useState(open);
  const changeHandleClose = () => {
    setAlertFlag(false);
    onClose(false);
  };
  useEffect(() => {
    setAlertFlag(open);
  });
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={alertFlag}
        autoHideDuration={duration || 6000}
        onClose={changeHandleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }} >
        <Alert onClose={changeHandleClose} severity={severityType} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </Stack>);
};