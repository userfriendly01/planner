import React from "react";
import {
  Attribute,
  ButtonWrapper,
  InformationText,
  InformationWapper,
  Key,
  ModalContainer,
  ResultWrapper,
  ResultsWrapper
} from "./CompareProfiles.Styles";
import { StyledButton } from "components";
import { ProgressBar } from "../BulkChanges/Processing";
import { ReportGmailerrorred } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { fetchResetProfileDatadogLogs, resetProfiles } from "services";

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
  const progressIntervalId = React.useRef<any>();
  const datadogIntervalId = React.useRef<any>();

  const [emailsConfirmed, setEmailsConfirmed] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [noAccess, setNoAccess] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState(null);

  console.log("PROGRESS INTERVAL ID", progressIntervalId);
  console.log("DATAGOD INTERVAL ID", datadogIntervalId);

  React.useEffect(() => {
    if (progress >= totalWaitSeconds) {
      setStatus(StatusOptions.FAIL);
      //Initiate failure steps
    }

  }, [progress]);

  React.useEffect(() => {
    console.log("FAITH STATUS", status);
    const timeout = 3000;
    if (status === StatusOptions.STARTED || status === StatusOptions.TIME_OUT) {
      progressIntervalId.current = setInterval(() => {
        console.log("We are running the progress interval");
        setProgress(progress => progress + 15)
      }, timeout);
      if (status === StatusOptions.TIME_OUT) {
        datadogIntervalId.current = setInterval(() => {
          console.log("We are running the datadog interval");
          fetchDatadogLog()
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
    }
    console.log("Reset Request", nNumber, body);
    try {
      const res = await resetProfiles(nNumber, body);
      setResults(res.data);
      setStatus(StatusOptions.SUCCESS);
    } catch (err) {
      if (err.response?.data?.message?.toLowerCase().trim() === "read timed out") {
        console.warn("Call to reset profiles timed out. Trying to fetch datadog log");
        setStatus(StatusOptions.TIME_OUT);
      } else {
        console.log("RESET PROFILES AWW", err, err.message, err.response, err.response.message);
        setProgress(totalWaitSeconds);
      }
    }
  }

  const fetchDatadogLog = async () => {
    const res: any = await fetchResetProfileDatadogLogs(nNumber);
    console.log("FETCH LOG RES", res);
    if (res.data.length > 0) {
      console.log("yay cancel everything and show the results!", res.data);
      setStatus(StatusOptions.SUCCESS);
      setResults(res.data[res.data.length - 1].attributes.attributes.sharedAdminAPILog.results);
    }
  }

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
      }
      {(status === StatusOptions.STARTED || status === StatusOptions.TIME_OUT) && <ProgressBar completedRows={progress} totalRowCount={totalWaitSeconds} />}
      {status === StatusOptions.FAIL &&
        <InformationWapper>
          <InformationText>
            Calabrio sucks sorry
          </InformationText>
          <ButtonWrapper>
            <StyledButton onClick={onClose}>Close</StyledButton>
          </ButtonWrapper>
        </InformationWapper>
      }
      {status === StatusOptions.SUCCESS && results &&
        <ResultsWrapper>
          <h1 style={{ alignSelf: "center" }}>Reset Results</h1>
          {results.map((r: any) => ((
            <ResultWrapper>
              <InformationText style={{ justifyContent: "flex-start" }}>
                <Key style={{ width: "85px" }}>Step {r.stepNumber}:</Key> <div style={{ textAlign: "left", marginLeft: "5px" }}>{r.description}</div>
              </InformationText>
              <InformationText style={{ justifyContent: "flex-start" }}>
                <Key>Result:</Key>
                {typeof r.result === "string" ?
                  <div style={{ textAlign: "left", maxWidth: "90%", marginLeft: "5px" }}>{r.result}</div>
                  :
                  <ResultWrapper>
                    {r.result.map((result: string) => ((
                      <div style={{ textAlign: "left", maxWidth: "90%", marginLeft: "5px" }}>{result}</div>
                    )))}
                  </ResultWrapper>
                }
              </InformationText>
              <Divider flexItem style={{ width: "100vw", margin: "10px 0px" }} />
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

export default ResetModal;