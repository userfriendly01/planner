import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  TextWrapper
} from "./BulkChanges.Styles";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  getWfmOrg,
  getWfmOptions
} from "services";
import React from "react";
import { CircularProgress } from "@mui/material";
import { theme } from "globals";


const WFMLoadOptionsModal = (props: any) => {
  const {
    handleClose
  } = props;

  const [ loadFailedMessage, setLoadFailedMessage ] = React.useState("");
  const [ showLoading, setShowLoading ] = React.useState(true);

  const state = useAdminState();
  const dispatch = useAdminDispatch();

  React.useEffect(() => {
    const areOptionsLoaded = state.calabrioContext.wfmOptions.length > 0;
    const isOrgLoaded = state.calabrioContext.wfmOrg.length > 0;
    retryLoad(1, areOptionsLoaded, isOrgLoaded);
  }, []);

  const retryLoad = async (attempt: number, areOptionsLoaded: boolean, isOrgLoaded: boolean) => {
    let successfulOptionsCall: boolean = areOptionsLoaded;
    let successfulOrgCall: boolean = isOrgLoaded;

    if (successfulOptionsCall && successfulOrgCall) {
      handleClose();
    }

    if (attempt <= 10) {

      if (!successfulOptionsCall && !successfulOrgCall) {
        const optionsCallPromise = getCalabrioWfmOptions(dispatch);
        const orgCallPromise = getCalabrioWfmOrg(dispatch);
        const promises = await Promise.allSettled([optionsCallPromise, orgCallPromise]);

        if (promises[0].status === "fulfilled") {
          successfulOptionsCall = promises[0]?.value;
        }
        if (promises[1].status === "fulfilled") {
          successfulOrgCall = promises[1]?.value;
        }

      } else if (!successfulOptionsCall && successfulOrgCall) {
        //   call options only
        successfulOptionsCall = await getCalabrioWfmOptions(dispatch);

      } else if (successfulOptionsCall && !successfulOrgCall) {
        //   call org only
        successfulOrgCall = await getCalabrioWfmOrg(dispatch);
      }

      if (!successfulOptionsCall || !successfulOrgCall) {
        retryLoad(attempt + 1, successfulOptionsCall, successfulOrgCall);
      } else {
        console.log("We have options!");
        handleClose();
      }
    } else {
      setShowLoading(false);
      setLoadFailedMessage("Max attempts to retrieve WFM Data reached.  Bulk Create for WFM is not available.  Please try again later...");
    }
  };

  const getCalabrioWfmOrg = async (dispatch: any) => {
    try {
      const org: any = await getWfmOrg();
      console.log("Calabrio WFM Org", org);
      dispatch({
        type: "loadWfmOrg",
        payload: org.data.organization.businessUnits
      });
      return true;
    } catch (error) {
      console.error("Failed to fetch calabrio wfm org from service");
      return false;
    }
  };

  const getCalabrioWfmOptions = async (dispatch: any) => {
    try {
      const options: any = await getWfmOptions();
      console.log("Calabrio WFM Options", options);
      dispatch({
        type: "loadWfmOptions",
        payload: options.data.organization.businessUnits
      });
      return true;
    } catch (error) {
      console.error("Failed to fetch calabrio wfm options from service");
      return false;
    }
  };

  // TODO: Add some spacing and styling to the text/circle loadythingy
  return (
    <ModalWrapper>
      <TextWrapper
        styles={{}}
      >
        WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations.  
        Attempting to load WFM Data...
      </TextWrapper>
      {showLoading && <CircularProgress style={{ margin: "15px" }} size={theme.circularProgressSize} />}
      <TextWrapper styles={{ size: "16px" }}>{loadFailedMessage}</TextWrapper>
      <ButtonWrapper>
        <Button onClick={() => handleClose()}>
            Cancel
        </Button>
      </ButtonWrapper>
    </ModalWrapper>
  );
};

export default WFMLoadOptionsModal;