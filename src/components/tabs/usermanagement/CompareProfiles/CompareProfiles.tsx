import React from "react";
import MessageBanner from "./MessageBanner";
import ProfileColumn from "./ProfileColumn";
import {
  CompareProfilesWrapper,
  ProfileColumnsWrapper
} from "./CompareProfiles.Styles";
import { NNumberInput } from "components";
import { useAdminState } from "context";
import { ProfilePayload, Worker } from "globals";
import { getWfmUserByNNumber, getQmUserProfiles } from "services";

const CompareProfiles = () => {
  const state = useAdminState();
  const environment = state.userContext.pingIdentity.environment;
  const profiles = state.profileContext.profiles;
  const [tritonProfiles, setTritonProfile] = React.useState([]);
  const [messageArray, setMessageArray] = React.useState([
    {
      level: "warning",
      message: "Any user being compared/corrected via this page should first be searched within the Security Identity Portal first to confirm their email's are aligned throughout all Systems. The reset Profiles functionality will NOT work unless all the emails mentioned are aligned. "
    }
  ]);
  const [calabrioQMProfiles, setCalabrioQMProfiles] = React.useState([]);
  const [calabrioWFMProfile, setCalabrioWFMProfile] = React.useState<any>({});

  const [nNumberDetails, setNNumberDetails] = React.useState({
    fetchedUser: null,
    nNumber: null
  });

  console.log("FAITH ENV", environment);
  console.log("FAITH WFM PERSON", calabrioWFMProfile);
  console.log("FAITH TRITON", tritonProfiles);

  React.useEffect(() => {
    if (nNumberDetails.fetchedUser) {
      fetchProfiles();
    }
  }, [nNumberDetails.fetchedUser]);

  const trimProfiles = (profiles: any[], system: string) => {
    if (system === "triton") {
      return profiles.map((p: Worker, index: number) => {
        return {
          ["id"]: index,
          ["Worker Sid"]: p.sid,
          ["N Number"]: p.attributes?.n_number || "",
          ["Email"]: p.attributes?.email || "",
          ["First Name"]: p.attributes?.emp_first_name || "",
          ["Last Name"]: p.attributes?.emp_last_name || "",
          ["Profile Id"]: p.attributes?.profile_id || "",
          ["Profile Name"]: profiles.find((prof: ProfilePayload) => prof.profile_id === p.attributes?.profile_id)?.profile_nme || "",
          ["Manager N Number"]: p.attributes?.manager_n_number || "",
          ["Manager First Name"]: p.attributes?.manager_first_name || "",
          ["Manager Last Name"]: p.attributes?.manager_last_name || "",
          ["Active"]: true
        }
      });
    } else if (system === "qm") {
      return profiles.map((p: any) => {
        return {

        }
      });
    } else if (system === "wfm") {
      return profiles.map((p: any) => {
        return {

        }
      });
    }
    return profiles;
  };

  const fetchProfiles = async () => {
    const workers = state.workerContext.workers;

    try {
      const matchingTritonProfiles = workers.filter((w: Worker) => w?.attributes?.n_number?.toLowerCase() === nNumberDetails?.nNumber?.toLowerCase());
      //make this a filter with a profile count check

      if (matchingTritonProfiles.length > 1) {
        setMessageArray((current: any) => [
          {
            level: "error",
            message: "It looks like this user has multiple Triton profiles. It's not recommended you use this functionality until you deactivate profiles you dont need, leaving one master Triton profile for this environment."
          },
          ...current
        ]);
      } else if (matchingTritonProfiles.length === 0) {
        setMessageArray((current: any) => [
          {
            level: "error",
            message: "It looks like this user has no Triton profiles. A Triton profile is needed to align with Calabrio WM and Calabrio WFM"
          },
          ...current
        ]);
      } else {
        const workerSid = matchingTritonProfiles[0].sid;
        const email = nNumberDetails.fetchedUser.email;

        setTritonProfile(matchingTritonProfiles);

        const wfmUserPromise = getWfmUserByNNumber(nNumberDetails.nNumber);
        const calabrioProfilesPromise = getQmUserProfiles(workerSid, nNumberDetails.nNumber, email);

        const [wfmResponse, calabrioProfilesResponse] = await Promise.all([wfmUserPromise, calabrioProfilesPromise]);

        const wfmProfiles = wfmResponse?.data?.Result || [];
        if (wfmProfiles.length > 0) {
          setCalabrioWFMProfile(wfmProfiles[0])
        }

        const qmProfiles = calabrioProfilesResponse.data || [];
        const activeQmProfiles = qmProfiles.filter((p: any) => p.deactivated === 32503593600000);
        const masterQmProfile = activeQmProfiles.find((p: any) => p.acdId.toUpperCase() === workerSid.toUpperCase() && p.isSynchronized);

        console.log("FAITH Active Profile", activeQmProfiles);
        console.log("FAITH Master Profile", masterQmProfile);

        if (masterQmProfile) {

        } else {

        }
      }
    } catch (err) {

    }
  }

  return (
    <CompareProfilesWrapper>
      <MessageBanner
        environment={environment}
        messageArray={messageArray}
        setMessageArray={setMessageArray}
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
          {nNumberDetails.fetchedUser &&
            <ProfileColumnsWrapper>
              <ProfileColumn people={trimProfiles(tritonProfiles, "triton")} />
              <ProfileColumn />
              {environment === "production" &&
                <ProfileColumn />
              }
            </ProfileColumnsWrapper>

          }
        </>
      }

    </CompareProfilesWrapper>
  );
};

export default CompareProfiles;