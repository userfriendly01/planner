import {
  getE164Number
} from "@lmig/phone-number-utils";
import {
  OutlinedSelect,
  ModalNNumber,
  ModalExtension,
  ModalOverlay,
  ModalPhoneNumber,
  PaperContainer,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths,
  extensionMatcher,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";
import {
  mapWorkerFromTwilioWorker,
  myAxios,
  sortManagersByName
} from "utils";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const Header = styled.h1`
  align-self: center;
`;

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const defaultNNumber = "n";

const AddUserModal = props => {

  const {
    handleClose
  } = props;
  const dispatch = useAdminDispatch();
  const {
    profileContext: {
      profiles
    },
    managerContext: {
      managers
    }
  } = useAdminState();

  const [form, setForm] = useState({
    extension: "",
    extensionValid: false,
    lookupInfo: {},
    manager: "",
    managerUpdated: false,
    nNumber: defaultNNumber,
    outgoing: "",
    outgoingValid: false,
    outgoingUpdated: false,
    team: "",
    teamUpdated: false
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: "",
    saveUser: false
  });

  const saveUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    let outgoingE164;
    try {
      outgoingE164 = getE164Number(form.outgoing);
    } catch (err) {
      console.error("AddUserModal - Failed to convert outgoing number to E164", {
        err,
        outgoingNumber: form.outgoing
      });
      updateLoading({
        ...loading,
        overlayMessage: "Failed to add new user. Could not convert outgoing number to E164 format.",
        saveStatus: modalOverlayStatuses.FAIL,
        saveUser: true
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveUser: false
        });
      }, modalOverlayTimeout);
      return;
    }
    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes = {
      did: outgoingE164,
      email: form.lookupInfo.email,
      email_address: form.lookupInfo.email,
      emp_first_name: form.lookupInfo.firstName,
      emp_last_name: form.lookupInfo.lastName,
      extension: form.extension,
      full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      n_number: form.nNumber.toLowerCase(),
      office_location_name: form.lookupInfo.officeName,
      office_location_number: form.lookupInfo.officeNumber,
      primary_dept_name: form.lookupInfo.departmentName,
      primary_dept_number: form.lookupInfo.departmentNumber,
      profile_id: form.team
    };
    myAxios.post(apiPaths.CREATE_WORKER, { attributes })
      .then(res => {
        const twilioWorker = res.data;
        setForm({
          ...form,
          extension: "", // clear out extension values
          extensionValid: false,
          lookupError: null, // clear out user lookup values
          lookupInfo: {},
          nNumber: defaultNNumber
        });
        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromTwilioWorker(twilioWorker)]
        });
        updateLoading({
          ...loading,
          overlayMessage: "Successfully added new user",
          saveStatus: modalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, modalOverlayTimeout);
      })
      .catch(err => {
        updateLoading({
          ...loading,
          overlayMessage: "Failed to add new user",
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, modalOverlayTimeout);
        console.error("AddUserModal - Failed to create worker in twilio workspace", err);
      });
  };

  const [ nNumberValid, setNNumberValid ] = useState(false);
  const extensionInputValid = (form.extensionValid || form.extension === "");
  const managerValid = form.manager !== "";
  const teamValid = form.team !== "";
  const formReady = nNumberValid && teamValid && managerValid && form.outgoingValid && extensionInputValid;

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={loading.overlayMessage}
          /> : null}
        <Header>Add a User</Header>
        <OutlinedSelect
          error={form.managerUpdated && !managerValid}
          helperText={managerValid ? null : "Please select a manager"}
          label={"Manager"}
          labelWidth={67}
          onBlur={() => setForm({
            ...form,
            managerUpdated: true
          })}
          optionsList={managers.sort(sortManagersByName)}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_n_number,
              value: JSON.stringify(option)
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            manager: newValue
          })}
          value={form.manager}
        />
        <OutlinedSelect
          error={form.teamUpdated && !teamValid}
          helperText={teamValid ? null : "Please select a team"}
          label={"Team"}
          labelWidth={44}
          onBlur={() => setForm({
            ...form,
            teamUpdated: true
          })}
          optionsList={profiles}
          optionsDisplayFunc={option => {
            return {
              display: option.profile_nme,
              key: option.profile_id,
              value: option.profile_id
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            team: newValue
          })}
          value={form.team}
        />
        <ModalPhoneNumber
          allowSevenDigitVdn={false}
          id="outgoing-number"
          number={form.outgoing}
          onBlur={() => setForm({
            ...form,
            outgoingUpdated: true
          })}
          label="Outgoing Number"
          showError={form.outgoingUpdated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setForm({
              ...form,
              outgoing: maskedValue,
              outgoingValid: isValid
            });
          }}
        />
        <ModalNNumber
          disabled={nNumberValid || loading.saveStatus === modalOverlayStatuses.SAVING}
          nNumber={form.nNumber}
          setIsValid={setNNumberValid}
          updateNNumber={newValue => setForm({
            ...form,
            nNumber: newValue
          })}
          resetParentState={() => setForm({
            ...form,
            lookupInfo: {},
            nNumber: defaultNNumber
          })}
        />
        <ModalExtension
          clearExtension={() => {
            setForm({
              ...form,
              extension: "",
              extensionValid: false
            });
          }}
          disabled={form.extensionValid && extensionMatcher.test(form.extension)}
          error={!extensionInputValid}
          extension={form.extension}
          updateValue={newValue => setForm({
            ...form,
            extension: newValue
          })}
          form={form}
          setForm={setForm}
        />
        <ButtonWrapper>
          <StyledButton disabled={!formReady} onClick={saveUser}>Add User</StyledButton>
          <StyledButton onClick={handleClose}>Close</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddUserModal.propTypes = {
  handleClose: PropTypes.func,
  managerList: PropTypes.arrayOf(
    PropTypes.shape({
      manager_first_name: PropTypes.string,
      manager_last_name: PropTypes.string,
      manager_n_number: PropTypes.string
    })
  )
};

export default AddUserModal;