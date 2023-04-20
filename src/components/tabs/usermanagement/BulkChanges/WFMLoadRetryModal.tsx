import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  TextWrapper
} from "./BulkChanges.Styles";
import {
  useAdminDispatch
} from "context";
import {
  getCalabrioWfmOptions, getCalabrioWfmOrg
} from "utils";
import React from "react";
import { CircularProgress } from "@mui/material";
import { theme } from "globals";


const WFMLoadRetryModal = (props: any) => {
  const {
    handleClose
  } = props;

  const [ loadFailedMessage, setLoadFailedMessage ] = React.useState("");
  const [ showLoading, setShowLoading ] = React.useState(true);
  const [ retryAttempts, setRetryAttempts ] = React.useState({
    count: 0,
    successfulWFMOptions: false,
    successfulWFMOrg: false,
    cancelClicked: false
  });

  const dispatch = useAdminDispatch();

  // This handles checking whether to keep calling the retry function
  React.useEffect(() => {

    if (retryAttempts.cancelClicked || (retryAttempts.successfulWFMOptions && retryAttempts.successfulWFMOrg)) {
      handleClose();
    } else if (!retryAttempts.cancelClicked && retryAttempts.count < 10) {
      retryLoad(retryAttempts.count, retryAttempts.successfulWFMOptions, retryAttempts.successfulWFMOrg);
    } else {
      setShowLoading(false);
      setLoadFailedMessage("Max attempts to retrieve WFM Data reached.  Bulk Create for WFM is not available.  Please try again later...");
    }
  }, [retryAttempts.count, retryAttempts.cancelClicked, retryAttempts.successfulWFMOptions, retryAttempts.successfulWFMOrg]);

  const retryLoad = async (attempt: number, areOptionsLoaded: boolean, isOrgLoaded: boolean) => {
    let successfulOptionsCall: boolean = areOptionsLoaded;
    let successfulOrgCall: boolean = isOrgLoaded;

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

    setRetryAttempts({
      ...retryAttempts,
      count: attempt + 1,
      successfulWFMOptions: successfulOptionsCall,
      successfulWFMOrg: successfulOrgCall
    });
  };

  const handleCancel = () => {
    setRetryAttempts({
      ...retryAttempts,
      cancelClicked: true
    });
  };

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
        <Button onClick={() => handleCancel()}>
            Cancel
        </Button>
      </ButtonWrapper>
    </ModalWrapper>
  );
};

export default WFMLoadRetryModal;