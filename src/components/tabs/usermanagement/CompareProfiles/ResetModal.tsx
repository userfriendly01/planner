import React from "react";
import { ButtonWrapper, InformationText, InformationWapper, ModalContainer } from "./CompareProfiles.Styles";
import { StyledButton } from "components";
import { ProgressBar } from "../BulkChanges/Processing";
import { ReportGmailerrorred } from "@mui/icons-material";

const ResetModal = (props: any) => {
  const {
    nNumber,
    email,
    workerSid,
    wfmPersonId,
    onClose
  } = props;

  const enum StatusOptions {
    STARTED = "started",
    TIME_OUT = "timeout",
    FAIL = "fail",
    SUCCESS = "success"
  }

  const totalWaitSeconds = 300;
  const [emailsConfirmed, setEmailsConfirmed] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [noAccess, setNoAccess] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const initiateReset = () => {
    setEmailsConfirmed(true);
    setStatus(StatusOptions.STARTED);
    const body = {
      wfmPersonId,
      email,
      workerSid,
    }
    console.log("Reset Request", nNumber, body);
    runProgressBar();
  }

  const runProgressBar = async () => {
    const increments = 60;
    const timeout = 3000;

    for (let i = 0; increments < i; i++) {
      await setTimeout(() => setProgress(progress => progress + 5), timeout);
    }
  };

  return (
    <ModalContainer>
      {!emailsConfirmed && !noAccess &&
        <InformationWapper>
          <InformationText>
            <ReportGmailerrorred sx={{ fontSize: "40px" }} />
            Before you reset profiles you have to go to this site and confirm that all 4 emails for {nNumber} match EXACTLY.
          </InformationText>
          <InformationText>They even need the same casing.</InformationText>
          <InformationText>(AD, LDAP(i), LDAP(e), HR)</InformationText>
          <InformationText>
            <a href="https://security-identity-portal.lmig.com/dashboard" target="_blank">Security Identity Portal</a>
          </InformationText>
          <ButtonWrapper>
            <StyledButton onClick={initiateReset}>The Emails all Match!</StyledButton>
            <StyledButton onClick={() => setNoAccess(true)}>I don't have access to this link</StyledButton>
            <StyledButton onClick={onClose}>Cancel</StyledButton>
          </ButtonWrapper>
        </InformationWapper>
      }
      {noAccess &&
        <InformationWapper>
          <InformationText>
            You need to get access to this link before using the Reset Profile Functionality. To aquire access, request this AD Group: gpi-grm-ro-access2SecurityIdentityPortal (requestit form 3041).
          </InformationText>
          <ButtonWrapper>
            <StyledButton onClick={onClose}>Close</StyledButton>
          </ButtonWrapper>

        </InformationWapper>
      }{status === StatusOptions.STARTED && <ProgressBar completedRows={progress} totalRowCount={totalWaitSeconds} />}
    </ModalContainer>
  );
};

export default ResetModal;