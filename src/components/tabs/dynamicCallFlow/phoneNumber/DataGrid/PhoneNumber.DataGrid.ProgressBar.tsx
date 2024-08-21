import {
  Box, LinearProgress, Typography
} from "@mui/material";
import { DataGridProgressBarInfo } from "components/tabs/dynamicCallFlow/common/DataGrid/Load.DataGrid.Monitor";
import React, {
  useEffect, useState
} from "react";

export const PHONE_NUMBER_DATA_GRID_PROGRESS_BAR_CACHE_KEY = "PHONE_NUMBER_DATA_GRID_PROGRESS_BAR";

interface PhoneNumberDataGridProgressBarProps {
  recordCount: number;
  dataGridLoaded?: boolean;
}

export const PhoneNumberDataGridProgressBar = ({
  recordCount,
  dataGridLoaded = false
}: PhoneNumberDataGridProgressBarProps): JSX.Element => {
  const [progress, setProgress] = useState(0);
  const [previousRecordCount, setPreviousRecordCount] = useState(0);

  useEffect(() => {
    const phoneNumberDataGridProgressBarInfo = (JSON.parse(localStorage.getItem(PHONE_NUMBER_DATA_GRID_PROGRESS_BAR_CACHE_KEY)) || {}) as DataGridProgressBarInfo;
    setPreviousRecordCount(phoneNumberDataGridProgressBarInfo.previousRecordCount || 25000);
  }, []);

  useEffect(() => {
    setProgress(oldProgress => {
      if (oldProgress === 100 || dataGridLoaded) {
        return 0;
      }

      return Math.trunc(recordCount / (previousRecordCount) * 100);
    });
  }, [recordCount]);

  useEffect(() => {
    if (dataGridLoaded) {
      setProgress(100);
    }
  }, [dataGridLoaded]);

  return (
    <div>
      {!dataGridLoaded &&
        <Box sx={{
          display: "flex",
          alignItems: "center"
        }}>
          <Box sx={{
            width: "70%",
            mr: 1
          }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${progress}%`}
            </Typography>
          </Box>
        </Box>
      }
    </div>
  );
};
