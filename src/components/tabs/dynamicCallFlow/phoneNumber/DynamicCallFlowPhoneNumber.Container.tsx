import PhoneNumberDataGridComponent from "./DataGrid/PhoneNumber.DataGrid.Component";
import { useAccessToken } from "authentication";
import {
  LoginInProgress,
  LoginError
} from "components";
import React from "react";

const DynamicCallFlowPhoneNumberContainer = () => {
  const {
    accessToken,
    matchedGroups,
    isLoading,
    error
  } = useAccessToken();

  // //TODO: Look to determine if useEffect is necessary here
  // useEffect(() => {
  //   const updateCacheData = () => {
  //     const lastFlowMasterDataSet = localStorage.getItem(LAST_FLOW_MASTER_DATA_CACHED_DATE);
  //     if(lastFlowMasterDataSet){
  //       const currentDate = new Date();
  //       const lastSetDate = new Date(lastFlowMasterDataSet);
  //       const difference: number = currentDate.getTime() - lastSetDate.getTime();
  //       const differenceInDays = difference / (1000*60*60*24);
  //       if(differenceInDays>1){
  //         localStorage.removeItem(FLOW_MASTER_DATA);
  //       }
  //     }
  //     else{
  //       localStorage.removeItem(FLOW_MASTER_DATA);
  //     }
  //   };
  //
  //   updateCacheData();
  // },[]);

  if (isLoading) {
    return <LoginInProgress />;
  }

  if (error) {
    return <LoginError message={error} />;
  }

  return (
    <PhoneNumberDataGridComponent accessToken={accessToken} matchedGroups={matchedGroups} />
  );
};

export default DynamicCallFlowPhoneNumberContainer;