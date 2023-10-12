import React from "react";
import MessageBanner from "./MessageBanner";
import ProfileColumn from "./ProfileColumn";
import {
  CompareProfilesWrapper,
  ProfileColumnsWrapper,
  ResetButton,
  StyledLoadSpinner
} from "./CompareProfiles.Styles";
import { CalabrioGroup, NNumberInput } from "components";
import { useAdminState } from "context";
import { ProfilePayload, WfmUser, Worker } from "globals";
import { getWfmUserByNNumber, getQmUserProfiles } from "services";
import { messageConsts } from "./messages";
import { Modal } from "@mui/material";
import ResetModal from "./ResetModal";

const CompareProfiles = () => {
  const state = useAdminState();
  const environment = state.userContext.pingIdentity.environment;
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;
  const [showModal, setShowModal] = React.useState(false);
  const [showColumns, setShowColumns] = React.useState(false);
  const [showResetButton, setShowResetButton] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

  const [tritonProfiles, setTritonProfile] = React.useState([]);
  const [calabrioQMProfiles, setCalabrioQMProfiles] = React.useState([]);
  const [calabrioWFMProfiles, setCalabrioWFMProfiles] = React.useState<any>([]);

  const [nNumberDetails, setNNumberDetails] = React.useState({
    fetchedUser: null,
    nNumber: null
  });

  console.log("FAITH MESSAGES", messages);
  console.log("FAITH ENV", environment);
  console.log("FAITH WFM PERSON", calabrioWFMProfiles);
  console.log("FAITH TRITON", tritonProfiles);

  React.useEffect(() => {
    if (nNumberDetails.fetchedUser) {
      fetchProfiles();
    } else {
      console.log("nNUmber?", nNumberDetails);
      setTritonProfile([]);
      setCalabrioQMProfiles([]);
      setCalabrioWFMProfiles([]);
    }
  }, [nNumberDetails.fetchedUser]);

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
      ]
    } else {
      newArray = messages.filter(m => m.id !== id);
    }
    newArray.forEach((m, index) => m.id = index);
    setMessages(newArray);
  };

  const trimProfiles = (userProfiles: any[], system: string) => {
    if (system === "triton") {
      return userProfiles.map((p: Worker, index: number) => {
        return {
          ["Worker Sid"]: p.sid,
          ["N Number"]: p.attributes?.n_number || "",
          ["Email"]: p.attributes?.email || "",
          ["First Name"]: p.attributes?.emp_first_name || "",
          ["Last Name"]: p.attributes?.emp_last_name || "",
          ["Profile Id"]: p.attributes?.profile_id || "",
          ["Profile Name"]: profiles.find((prof: any) => prof.profile_id === p.attributes?.profile_id)?.profile_nme || "",
          ["Manager N Number"]: p.attributes?.manager_n_number || "",
          ["Manager First Name"]: p.attributes?.manager_first_name || "",
          ["Manager Last Name"]: p.attributes?.manager_last_name || "",
          ["Active"]: true
        }
      });
    } else if (system === "qm") {
      return userProfiles.map((p: any) => {
        return {
          ["Acd Id"]: p.acdId,
          ["Ad Login"]: p.adLogin,
          ["Email"]: p.email,
          ["First Name"]: p.firstName,
          ["Last Name"]: p.lastName,
          ["Team"]: calabrioTeams.find((c: CalabrioGroup) => c.groupId === p.groupId)?.name || "Not Found",
          ["User Id"]: p.id,
          ["Active"]: p.deactivated === 32503593600000
        }
      });
    } else if (system === "wfm") {
      return userProfiles.map((p: any) => {
        return {
          ["Employment Number"]: p.EmploymentNumber,
          ["Identity"]: p.Identity,
          ["Email"]: p.Email,
          ["First Name"]: p.FirstName,
          ["Last Name"]: p.LastName,
          ["Business Unit Id"]: p.BusinessUnitId,
          ["Team Id"]: p.TeamId,
          ["Person Id"]: p.Id,
          ["Active"]: true
        }
      });
    }
    return userProfiles;
  };

  const fetchProfiles = async () => {
    const workers = state.workerContext.workers;

    try {
      const matchingTritonProfiles = workers.filter((w: Worker) => w?.attributes?.n_number?.toLowerCase() === nNumberDetails?.nNumber?.toLowerCase());

      if (matchingTritonProfiles.length > 1) {
        updateMessages("add", null, messageConsts.MULTIPLE_TRITON_PROFILES, "error");
      } else if (matchingTritonProfiles.length === 0) {
        updateMessages("add", null, messageConsts.MISSING_TRITON_PROFILE, "error");
      } else {
        const workerSid = matchingTritonProfiles[0].sid;
        const email = nNumberDetails.fetchedUser.email;

        setTritonProfile(matchingTritonProfiles);

        const wfmUserPromise = getWfmUserByNNumber(nNumberDetails.nNumber);
        const calabrioProfilesPromise = getQmUserProfiles(workerSid, nNumberDetails.nNumber, email);

        const [wfmResponse, calabrioProfilesResponse] = await Promise.all([wfmUserPromise, calabrioProfilesPromise]);

        const wfmProfiles = wfmResponse?.data?.Result || [];
        if (wfmProfiles.length === 1) {
          setCalabrioWFMProfiles(wfmProfiles)
        } else if (wfmProfiles.length > 1) {
          const personIds = wfmProfiles.map((p: WfmUser) => p.Id);
          updateMessages("add", null, `${messageConsts.WFM_MULTIPLE_PROFILES} Person Ids: ${JSON.stringify(personIds)}`, "error");
        } else {
          updateMessages("add", null, messageConsts.WFM_NO_PROFILE_FOUND, "warning");
        }

        const qmProfiles = calabrioProfilesResponse.data || [];
        console.log("FAITH QM Profiles", qmProfiles);

        const activeQmProfiles = qmProfiles.filter((p: any) => p.deactivated === 32503593600000);
        const masterQmProfile = qmProfiles.find((p: any) => p.acdId.toUpperCase() === workerSid.toUpperCase() && p.isSynchronized);

        console.log("FAITH Active Profile", activeQmProfiles);
        console.log("FAITH Master Profile", masterQmProfile);

        if (masterQmProfile || true) {
          // if (masterQmProfile) {
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
    } catch (err) {
      updateMessages("add", null, `${messageConsts.ERROR}: ${err.message}}`, "error");
    }
  };

  return (
    <CompareProfilesWrapper>
      <MessageBanner
        environment={environment}
        messages={messages}
        updateMessages={updateMessages}
      />
      {environment !== "development" &&
        <>
          <NNumberInput
            disabled={false}
            fetchedUser={nNumberDetails.fetchedUser}
            label="N Number *"
            onClear={() => setNNumberDetails({
              fetchedUser: null,
              nNumber: null
            })}
            onComplete={(fetchedUser: any, nNumber: any) => setNNumberDetails({
              nNumber,
              fetchedUser
            })}
            onUpdate={(nNumber: string) => {
              setNNumberDetails({
                nNumber,
                fetchedUser: nNumberDetails.fetchedUser
              })
            }
            }
            value={nNumberDetails.nNumber}
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
              {/* {environment === "production" && */}
              <ProfileColumn people={trimProfiles(calabrioWFMProfiles, "wfm")} title="Calabrio WFM" />
              {/* } */}
            </ProfileColumnsWrapper>
          }
          <Modal onClose={() => { return; }} open={showModal === true}>
            <>
              <ResetModal
                nNumber={nNumberDetails?.nNumber}
                email={nNumberDetails?.fetchedUser?.email}
                workerSid={tritonProfiles[0] && tritonProfiles[0].sid}
                wfmPersonId={calabrioWFMProfiles[0] && calabrioWFMProfiles[0].Id}
                onClose={() => setShowModal(false)}
              />
            </>
          </Modal>
        </>
      }

    </CompareProfilesWrapper>
  );
};

export default CompareProfiles;