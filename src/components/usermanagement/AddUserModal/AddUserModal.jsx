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
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import { myAxios } from "services";
import styled from "styled-components";
import {
  mapWorkerFromTwilioWorker,
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
    lookupInfo: {},
    manager: "",
    outgoing: "",
    team: ""
  });
  const [nNumber, setNNumber] = useState(defaultNNumber);
  const [extension, setExtension] = useState("");
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });

  const clearUser = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {}
    });
    setNNumber(defaultNNumber);
  };

  const saveUser = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes = {
      did: `+1${form.outgoing.replace(/[\D]/g, "")}`,
      email: form.lookupInfo.email,
      email_address: form.lookupInfo.email,
      emp_first_name: form.lookupInfo.firstName,
      emp_last_name: form.lookupInfo.lastName,
      full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      n_number: nNumber.toLowerCase(),
      extension,
      office_location_name: form.lookupInfo.officeName,
      office_location_number: form.lookupInfo.officeNumber,
      primary_dept_name: form.lookupInfo.departmentName,
      primary_dept_number: form.lookupInfo.departmentNumber,
      profile_id: form.team
    };
    myAxios
      .post(apiPaths.CREATE_WORKER, { attributes })
      .then(res => {
        const twilioWorker = res.data;
        clearUser();
        dispatch({
          type: "addWorker",
          payload: mapWorkerFromTwilioWorker(twilioWorker)
        });
        updateLoading({
          ...loading,
          saveStatus: "success",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
      })
      .catch(err => {
        updateLoading({
          ...loading,
          saveStatus: "fail",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
        console.error("AddUserModal - Failed to add create worker in twilio workspace", err);
      });
  };
  const isLookupInfoEmpty = JSON.stringify(form.lookupInfo) === JSON.stringify({});
  const formReady = !isLookupInfoEmpty && form.team !== "" && form.manager !== "" && form.outgoing !== "";

  let overlayMessage = "Saving";
  if (loading.saveStatus === "success") {
    overlayMessage = "User added successfully";
  } else if (loading.saveStatus === "fail") {
    overlayMessage = "Failed to add user";
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={overlayMessage}
          /> : null}
        <Header>Add a User</Header>
        <OutlinedSelect
          label={"Manager"}
          labelWidth={65}
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
          label={"Team"}
          labelWidth={41}
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
          outgoingNumber={form.outgoing}
          updateValue={newValue => setForm({
            ...form,
            outgoing: newValue
          })}
        />
        <ModalNNumber
          clearUser={clearUser}
          disabled={JSON.stringify(form.lookupInfo) !== "{}"}
          form={form}
          nNumber={nNumber}
          setForm={setForm}
          updateValue={newValue => setNNumber(newValue)}
        />
        <ModalExtension
          extension={extension}
          updateValue={newValue => setExtension(newValue)}
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
