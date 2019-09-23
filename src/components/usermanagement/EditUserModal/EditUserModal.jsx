//This modal will pull in the current user & display their user name as read only as well as a dropdown that feeds from the managers list within the context.
//? Do we want to display the manager that's currently selected or a "select new manager" - start with Select for MVP
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  // useAdminDispatch,
  useAdminState
} from "context";
// import {
//   // apiPaths
// } from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "globals";
// import { myAxios } from "utils";

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

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ModalText = styled.div`
  align-self: center;
  color: ${theme.textColor};
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0rem;
  line-height: 1.30357em;
  margin: 2%;
`;

//Need to create a method in the service to edit user

const EditUserModal = props => {

  const {
    handleClose,
    worker
  } = props;
  // const dispatch = useAdminDispatch();
  const {
    managerContext: {
      managers
    }
  } = useAdminState();

  const [form, setForm] = useState({
    nNumber: worker.attributes.n_number,
    manager: "",
    outgoing: "",
    team: ""
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });
  const clearUser = () => {
    setForm({
      ...form,
      nNumber: worker.attributes.n_number
    });
  };
  const saveUser = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
    //Take this away after
    clearUser();
  };

  // myAxios
  //   .post(apiPaths.EDIT_WORKER, { attributes })
  //   .then(res => {
  //     clearUser();
  //     dispatch({
  //       type: "editWorker",
  //       payload: {
  //         id: form.nNumber,
  //         attributes
  //       }
  //     });
  //     updateLoading({
  //       ...loading,
  //       saveStatus: "success",
  //       saveUser: true
  //     });
  //     setTimeout(() => {
  //       updateLoading({
  //         ...loading,
  //         saveUser: false
  //       });
  //     }, 2000);
  //     console.log(res);
  //   })
  //   .catch(err => {
  //     updateLoading({
  //       ...loading,
  //       saveStatus: "fail",
  //       saveUser: true
  //     });
  //     setTimeout(() => {
  //       updateLoading({
  //         ...loading,
  //         saveUser: false
  //       });
  //     }, 2000);
  //     console.log(err);
  //   });

  const formReady = form.manager !== "";

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={loading.saveStatus === "success" ? "User added successfully" : "Failed to add user"}
          /> : null}
        <ModalHeader>
          {"Edit User"}
        </ModalHeader>
        <ModalText>{worker.attributes.full_name}</ModalText>
        <CustomSelect
          label={"Manager"}
          labelWidth={65}
          optionsList={managers}
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
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUser}>
            {"Update"}
          </CustomButton>
          <CustomButton onClick={handleClose}>
            {"Close"}
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func,
  worker: PropTypes.shape({
    attributes: PropTypes.shape({
      full_name: PropTypes.string,
      n_number: PropTypes.string
    })
  })
};

export default EditUserModal;