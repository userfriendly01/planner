import {
  TritonPerson, QmPerson, WfmPerson
} from "usermanagement/CompareProfiles.Interfaces";
import {
  CompareProfilesWrapper,
  ProfileColumnsWrapper,
  ResetButton,
  StyledLoadSpinner
} from "usermanagement/CompareProfiles.Styles";
import { MessageBanner } from "usermanagement/MessageBanner";
import { messageConsts } from "usermanagement/messages";
import { ProfileColumn } from "usermanagement/ProfileColumn";
import { ResetModal } from "usermanagement/ResetModal";
import {
  WfmUser, UMUser,
  UMSoftphoneConfiguration
} from "globals/interfaces";
import {
  env, nNumMatcher
} from "globals";
import { CalabrioGroup } from "usermanagement/CallRecording.Interfaces";
import { NNumberInput } from "components/NNumberInput";
import { useAdminState } from "context/appContext";
import React from "react";
import {
  getWfmUserByNNumber, getQmUserProfiles, getWfmTeam
} from "services/calabrio";
import util from "util";
import {
  getWfmBusinessUnits, getWfmTeams
} from "utils/calabrioUtils";
import { logger } from "utils/logger";
import { Modal } from "@mui/material";

export const CompareProfiles = () => {
  //State
  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;

  //Environment Control
  const isProduction = env.APP_ENV === "production";
  const isDevelopment = env.APP_ENV === "development";

  //Form Control
  const [showModal, setShowModal] = React.useState(false);
  const [showColumns, setShowColumns] = React.useState(false);
  const [showResetButton, setShowResetButton] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

  //User Management
  const [tritonProfiles, setTritonProfiles] = React.useState([]);
  const [calabrioQMProfiles, setCalabrioQMProfiles] = React.useState([]);
  const [calabrioWFMProfiles, setCalabrioWFMProfiles] = React.useState<any>([]);
  const [nNumberDetails, setNNumberDetails] = React.useState({
    fetchedUser: null,
    nNumber: null
  });

  logger.info("Reset User Details", {
    nNumberDetails,
    tritonProfiles,
    calabrioQMProfiles,
    calabrioWFMProfiles
  });

  React.useEffect(() => {
    if (nNumberDetails.fetchedUser) {
      fetchProfiles();
    }
  }, [nNumberDetails.fetchedUser]);

  const resetForm = () => {
    setShowModal(false);
    setShowColumns(false);
    setTritonProfiles([]);
    setCalabrioQMProfiles([]);
    setCalabrioWFMProfiles([]);
    setShowResetButton(false);
    setNNumberDetails({
      fetchedUser: null,
      nNumber: null
    });
  };

  const updateMessages = (action: string, id?: number, message?: string, level?: string) => {
    let newArray;
    if (action === "add") {
      newArray = [
        ...messages,
        {
          id: null,
          message,
          level
        }
      ];
    } else {
      newArray = messages.filter(m => m.id !== id);
    }
    newArray.forEach((m, index) => m.id = index);
    setMessages(newArray);
  };

  const fetchTeam = async (p: WfmPerson) => {
    try {
      const teamInState = getWfmTeams(state).find(tm => tm.Id === p.TeamId);
      if (teamInState) {
        return teamInState.Name;
      } else if (p.BusinessUnitId && p.TeamId) {
        const res = await getWfmTeam(state.userContext.tokens.calabrioService, p.BusinessUnitId, p.TeamId);
        if (res.data.Result.length > 0) {
          return res.data.Result[0].Name;
        } else {
          throw Error("Fetch Team Results array was empty");
        }
      } else {
        throw Error("Business Unit or Team Id were invalid to fetch Team");
      }
    } catch (error) {
      logger.error(messageConsts.ERROR, {
        error,
        message: `Failed to fetch WFM Team for BU ${p.BusinessUnitId}: Team ${p.TeamId}`
      }, false);
      return p.TeamId || "";
    }
  };

  const trimProfiles = (userProfiles: any[], system: string): TritonPerson[] | QmPerson[] | WfmPerson[] | any[] => {
    if (system === "triton") {
      return userProfiles.map((p: UMUser) => {
        return {
          ["Worker Sid"]: p.sid,
          ["N Number"]: p.attributes?.n_number,
          ["Email"]: p.attributes?.email || "",
          ["First Name"]: p.attributes?.emp_first_name || "",
          ["Last Name"]: p.attributes?.emp_last_name || "",
          ["Profile Id"]: p.attributes?.profile_id?.toString() || "",
          ["Profile Name"]: profiles.find((prof: UMSoftphoneConfiguration) => prof.profile_id === p.attributes?.profile_id)?.profile_name || "",
          ["Manager N Number"]: p.attributes?.manager_n_number || "",
          ["Manager First Name"]: p.attributes?.manager_first_name || "",
          ["Manager Last Name"]: p.attributes?.manager_last_name || "",
          ["Active"]: true
        };
      });
    } else if (system === "qm") {
      return userProfiles.map((p: any) => {
        return {
          ["Acd Id"]: p.acdId || "",
          ["Ad Login"]: p.adLogin || "",
          ["Email"]: p.email || "",
          ["First Name"]: p.firstName || "",
          ["Last Name"]: p.lastName || "",
          ["Team"]: calabrioTeams.find((c: CalabrioGroup) => c.groupId === p.groupId)?.name || "Not Found",
          ["User Id"]: p.id,
          ["Active"]: p.deactivated === 32503593600000
        };
      });
    } else {
      return userProfiles.map((p: any) => {
        return {
          ["Employment Number"]: p.EmploymentNumber || "",
          ["Identity"]: p.Identity || "",
          ["Email"]: p.Email || "",
          ["First Name"]: p.FirstName || "",
          ["Last Name"]: p.LastName || "",
          ["Business Unit Id"]: getWfmBusinessUnits(state).find(bu => bu.Id === p.BusinessUnitId)?.Name || "",
          ["Team Id"]: p.TeamName || "",
          ["Person Id"]: p.Id || "",
          ["Active"]: true
        };
      });
    }
  };

  const fetchProfiles = async () => {
    const workers = state.workerContext.workers;

    try {

      const matchingTritonProfiles = workers.filter((w: UMUser) => w?.attributes?.n_number?.toLowerCase() === nNumberDetails?.nNumber?.toLowerCase());
      if (matchingTritonProfiles.length > 1) {
        updateMessages("add", null, messageConsts.MULTIPLE_TRITON_PROFILES, "error");
      } else if (matchingTritonProfiles.length === 0) {
        updateMessages("add", null, messageConsts.MISSING_TRITON_PROFILE, "error");
      } else {

        const workerSid = matchingTritonProfiles[0].sid;
        const email = nNumberDetails.fetchedUser.email;
        setTritonProfiles(matchingTritonProfiles);

        const wfmUserPromise = isProduction ? getWfmUserByNNumber(state.userContext.tokens.calabrioService, nNumberDetails.nNumber) : Promise.resolve({ data: []});
        const calabrioProfilesPromise = getQmUserProfiles(state.userContext.tokens.calabrioService, workerSid, nNumberDetails.nNumber, email);

        const [wfmResponse, calabrioProfilesResponse]: [any, any] = await Promise.all([wfmUserPromise, calabrioProfilesPromise]);

        const wfmProfiles: any[] = wfmResponse?.data?.Result || [];
        if (wfmProfiles.length === 1) {
          const team = await fetchTeam(wfmProfiles[0]);
          wfmProfiles[0].TeamName = team;
          setCalabrioWFMProfiles(wfmProfiles);
        } else if (wfmProfiles.length > 1) {
          const personIds = wfmProfiles.map((p: WfmUser) => p.Id);
          updateMessages("add", null, `${messageConsts.WFM_MULTIPLE_PROFILES} Person Ids: ${JSON.stringify(personIds)}`, "error");
        } else if (isProduction) {
          updateMessages("add", null, messageConsts.WFM_NO_PROFILE_FOUND, "warning");
        }

        const qmProfiles = calabrioProfilesResponse.data || [];
        const masterQmProfile = qmProfiles.find((p: any) => p.acdId?.toUpperCase() === workerSid?.toUpperCase() && p.isSynchronized);
        if (masterQmProfile) {
          qmProfiles.forEach((p: any, i: number) => {
            if (p.id === masterQmProfile?.id) {
              qmProfiles.splice(i, 1);
              qmProfiles.unshift(p);
            }
          });
          setCalabrioQMProfiles(qmProfiles);
          setShowResetButton(true);
        } else {
          updateMessages("add", null, messageConsts.MISSING_CALABRIO_MASTER_PROFILE, "error");
        }
        setShowColumns(true);
      }
    } catch (error) {
      const errorString = error.message || error.response?.message || util.format(error);
      logger.error(messageConsts.ERROR, {
        error,
        message: errorString,
        nNumber: nNumberDetails.nNumber
      });
      updateMessages("add", null, `${messageConsts.ERROR}: ${errorString}`, "error");
    }
  };

  return (
    <CompareProfilesWrapper>
      <MessageBanner
        messages={messages}
        updateMessages={updateMessages}
      />
      {!isDevelopment &&
      <>
        <NNumberInput
          disabled={false}
          fetchedUser={nNumberDetails.fetchedUser}
          label="N Number *"
          onClear={resetForm}
          onComplete={(fetchedUser: any, nNumber: any) => setNNumberDetails({
            nNumber,
            fetchedUser
          })}
          onUpdate={(nNumber: string) => {
            const isValid = nNumber.match(nNumMatcher) !== null;
            if (!isValid) {
              resetForm();
            }
            setNNumberDetails({
              nNumber,
              fetchedUser: null
            });
          }}
          value={nNumberDetails.nNumber || ""}
        />
        {showResetButton &&
            <ResetButton
              sx={{ marginTop: "40px" }}
              onClick={() => setShowModal(true)}>
              Reset Profiles
            </ResetButton>}
        {nNumberDetails.fetchedUser && !showColumns && <StyledLoadSpinner />}
        {nNumberDetails.fetchedUser && showColumns &&
            <ProfileColumnsWrapper>
              <ProfileColumn people={trimProfiles(tritonProfiles, "triton")} title="Triton" />
              <ProfileColumn people={trimProfiles(calabrioQMProfiles, "qm")} title="Calabrio QM" />
              {isProduction && calabrioWFMProfiles.length > 0 &&
                <ProfileColumn people={trimProfiles(calabrioWFMProfiles, "wfm")} title="Calabrio WFM" />
              }
            </ProfileColumnsWrapper>
        }
        <Modal onClose={() => { return; }} open={showModal}>
          <>
            <ResetModal
              nNumber={nNumberDetails?.nNumber}
              email={nNumberDetails?.fetchedUser?.email}
              workerSid={tritonProfiles[0] && tritonProfiles[0].sid}
              wfmPersonId={calabrioWFMProfiles[0] && calabrioWFMProfiles[0].Id}
              onClose={resetForm}
            />
          </>
        </Modal>
      </>
      }

    </CompareProfilesWrapper>
  );
};