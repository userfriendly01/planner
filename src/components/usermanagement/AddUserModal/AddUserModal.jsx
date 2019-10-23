import {
  OutlinedSelect,
  ModalHelperText,
  ModalNNumber,
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
  nNumMatcher
} from "globals";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import {
  mapWorkerFromTwilioWorker,
  myAxios,
  sortManagersByName
} from "utils";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

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

const ModalContainer = styled(FlexColumn)`
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
    nNumber: defaultNNumber,
    manager: "",
    outgoing: "",
    team: ""
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });

  useEffect(() => {
    if (form.nNumber.match(nNumMatcher)) {
      updateLoading({
        ...loading,
        lookupUser: true
      });
      myAxios
        .get(apiPaths.EMPLOYEE_LOOKUP(form.nNumber.substring(1)))
        .then(res => {
          if (res.data.length !== 0) {
            setForm({
              ...form,
              lookupError: null,
              lookupInfo: {
                email: res.data[0].person.data.Email,
                firstName: res.data[0].person.data.FirstName,
                lastName: res.data[0].person.data.LastName,
                officeName: res.data[0].person.data.OfficeName,
                officeNumber: res.data[0].person.data.OfficeNumber,
                departmentName: res.data[0].person.data.DepartmentName,
                departmentNumber: res.data[0].person.data.DepartmentNumber
              }
            });
          } else {
            setForm({
              ...form,
              lookupInfo: {},
              lookupError: "User not found"
            });
          }
        })
        .catch(err => {
          setForm({
            ...form,
            lookupInfo: {},
            lookupError: `Error calling lookup service: ${err.message}`
          });
        })
        .finally(() => {
          updateLoading({
            ...loading,
            lookupUser: false
          });
        });
    }
  }, [form.nNumber]);

  const clearUser = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {},
      nNumber: defaultNNumber
    });
  };

  const saveUser = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    const attributes = {
      did: `+1${form.outgoing.replace(/[\D]/g, "")}`,
      email: form.lookupInfo.email,
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
  const showModalHelperText = !isLookupInfoEmpty || form.lookupError;
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
        <FlexColumn>
          <ModalNNumber
            disabled={JSON.stringify(form.lookupInfo) !== "{}"}
            label="N Number"
            loading={loading.lookupUser}
            name="N Number"
            nNumber={form.nNumber}
            updateValue={newValue => setForm({
              ...form,
              nNumber: newValue
            })}
          />
          {
            showModalHelperText
              ? <ModalHelperText
                clearUser={clearUser}
                error={form.lookupError ? true : false}
                message={form.lookupError || `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`}
              />
              : null
          }
        </FlexColumn>
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
