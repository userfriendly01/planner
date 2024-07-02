import React from "react";
import {
  ResetModalProps,
  Result,
  StatusOptions
} from "usermanagement/CompareProfiles.Interfaces";
import {
  ButtonWrapper,
  InformationText,
  InformationWapper,
  Key,
  ModalContainer,
  ResultWrapper,
  ResultsWrapper
} from "usermanagement/CompareProfiles.Styles";
import { StyledButton } from "components/StyledButton";
import { ProgressBar } from "usermanagement/ProgressBar";
import { ReportGmailerrorred } from "@mui/icons-material";
import { Divider } from "@mui/material";
import {
  fetchResetProfileDatadogLogs, resetProfiles
} from "services/resetprofiles";
import { useAdminState } from "context/appContext";
import { logger } from "utils/logger";
import util from "util";

export const ResetModal = (props: ResetModalProps) => {
  const {
    nNumber,
    email,
    workerSid,
    wfmPersonId,
    onClose
  } = props;

  const totalWaitSeconds = 600;
  const progressIntervalId = React.useRef<any>();
  const datadogIntervalId = React.useRef<any>();

  const [emailsConfirmed, setEmailsConfirmed] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [noAccess, setNoAccess] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState(null);
  const state = useAdminState();

  React.useEffect(() => {
    if (progress >= totalWaitSeconds) {
      setResults("We waited a while but the log was not found in datadog. We're unable to confirm this process succeeded. Please try again.");
      setStatus(StatusOptions.FAIL);
    }
  }, [progress]);

  React.useEffect(() => {
    const timeout = 3000;
    if (status === StatusOptions.STARTED || status === StatusOptions.TIME_OUT) {
      progressIntervalId.current = setInterval(() => {
        setProgress(progress => progress + 15);
      }, timeout);
      if (status === StatusOptions.TIME_OUT) {
        datadogIntervalId.current = setInterval(() => {
          fetchDatadogLog();
        }, timeout);
      }
    } else {
      clearInterval(progressIntervalId.current);
      progressIntervalId.current = null;
      clearInterval(datadogIntervalId.current);
      datadogIntervalId.current = null;
    }
    return () => {
      clearInterval(progressIntervalId.current);
      clearInterval(datadogIntervalId.current);
    };
  }, [status]);

  const initiateReset = async () => {
    setEmailsConfirmed(true);
    setStatus(StatusOptions.STARTED);

    const body = {
      wfmPersonId,
      email,
      workerSid
    };
    try {
      const res = await resetProfiles(state.userContext.tokens.adminService, nNumber, body);
      setResults(res.data);
      setStatus(StatusOptions.SUCCESS);
    } catch (error) {
      const isTimeout = error?.response?.data?.message?.toLowerCase().trim() === "read timed out" || error?.response?.data?.error?.message?.toLowerCase().trim() === "endpoint request timed out";
      if (isTimeout) {
        logger.warn("Call to reset profiles timed out. Trying to fetch datadog log", { nNumber });
        setStatus(StatusOptions.TIME_OUT);
      } else {
        const errorString = error.message || error.response?.message || util.format(error);
        const errorMessage = "Reset Profiles failed calling the Calabrio service";
        logger.error(errorMessage, {
          error,
          message: errorString,
          nNumber
        });
        setResults(`${errorMessage} - ${errorString}`);
        setStatus(StatusOptions.FAIL);
      }
    }
  };

  const fetchDatadogLog = async () => {
    try {
      const res: any = await fetchResetProfileDatadogLogs(nNumber);
      if (res.data.length > 0) {
        setStatus(StatusOptions.SUCCESS);
        setResults(res.data[res.data.length - 1].attributes.attributes.sharedAdminAPILog.results);
      }
    } catch (error) {
      const errorString = error.message || error.response?.message || util.format(error);
      const errorMessage = "Reset Profiles failed calling Datadog";
      logger.error(errorMessage, {
        error,
        message: errorString
      });
      setResults(`${errorMessage} - ${errorString}`);
      setStatus(StatusOptions.FAIL);
    }
  };

  return (
    <ModalContainer>
      {!emailsConfirmed && !noAccess &&
        <InformationWapper>
          <InformationText style={{ alignItems: "center" }}>
            <ReportGmailerrorred sx={{ fontSize: "40px" }} />
            Before you reset profiles you have to go to this site and confirm that all 4 emails for {nNumber} match EXACTLY.
          </InformationText>
          <InformationText>They even need the same casing.</InformationText>
          <InformationText>(AD, LDAP(i), LDAP(e), HR)</InformationText>
          <InformationText>
            <a href="https://security-identity-portal.lmig.com/dashboard" target="_blank" rel="noreferrer">Security Identity Portal</a>
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
      }
      {(status === StatusOptions.STARTED || status === StatusOptions.TIME_OUT) && <ProgressBar completedRows={progress} totalRowCount={totalWaitSeconds} />}
      {status === StatusOptions.FAIL &&
        <InformationWapper style={{
          marginTop: "10",
          minHeight: "200px",
          height: "auto"
        }}>
          <InformationText>
            Calabrio... is the worst we're sorry
          </InformationText>
          <InformationText>
            {results}
          </InformationText>
          <ButtonWrapper style={{ minHeight: "30%" }}>
            <StyledButton onClick={onClose}>Close</StyledButton>
          </ButtonWrapper>
        </InformationWapper>
      }
      {status === StatusOptions.SUCCESS && results &&
        <ResultsWrapper>
          <h1 style={{ alignSelf: "center" }}>Reset Results</h1>
          {results.map((r: Result) => ((
            <ResultWrapper key={r.stepNumber}>
              <InformationText style={{ justifyContent: "flex-start" }}>
                <Key style={{ width: "85px" }}>Step {r.stepNumber}:</Key> <div style={{
                  textAlign: "left",
                  marginLeft: "5px"
                }}>{r.description}</div>
              </InformationText>
              <InformationText style={{ justifyContent: "flex-start" }}>
                <Key>Result:</Key>
                {typeof r.result === "string" ?
                  <div style={{
                    textAlign: "left",
                    maxWidth: "90%",
                    marginLeft: "13px"
                  }}>{r.result}</div>
                  :
                  <ResultWrapper>
                    {r.result.map((result: string) => ((
                      <div key={result} style={{
                        textAlign: "left",
                        maxWidth: "90%",
                        marginLeft: "5px"
                      }}>{result}</div>
                    )))}
                  </ResultWrapper>
                }
              </InformationText>
              <Divider flexItem style={{
                width: "100vw",
                margin: "10px 0px"
              }} />
            </ResultWrapper>
          )))}
          <ButtonWrapper>
            <StyledButton style={{ alignSelf: "center" }} onClick={onClose}>Close</StyledButton>
          </ButtonWrapper>
        </ResultsWrapper>
      }
    </ModalContainer>
  );
};