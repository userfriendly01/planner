import React, { useState } from "react";
import { StyledButton } from "components";
import styled from "styled-components";
import {
  Edit,
  Delete,
  FileDownload
} from "@mui/icons-material";

const MessageBoxWrapper = styled.div`
  display: flex;
  width: 600px;
  margin-top: 25px;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`

`;

const ActionBar = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-around
`;

const TextField = styled.textarea`
  background-color: rgba(0,0,0,0.04);
  padding: 10px;
  height: 150px;
  width: 500px;
  margin: 5 0 10 0;
`;

export const UserFormButton = styled(StyledButton)`
  height: 40px;
  width: 450px;
  margin-bottom: 15px; 
`;

interface MessageBoxProps {
  selected: any[],
  messageType: string
}

export const MessageBox = (props: MessageBoxProps) => {
  const {
    selected,
    messageType
  } = props;

  const isMulti = selected.length > 1;
  const action = "Update";

  return (
    <MessageBoxWrapper>
      <Header>{messageType}</Header>
      <ActionBar>
        <Edit />
        <Delete />
        {isMulti && <FileDownload />}
      </ActionBar>
      <TextField>
        Heres some text.
      </TextField>
      {selected.length > 0 &&
        <UserFormButton>
          { isMulti ?
            `${action} ${selected.length} ${messageType}s`
            : `${action} ${selected[0]} ${messageType}`
          }
        </UserFormButton>
      }
    </MessageBoxWrapper>
  );
};

export default MessageBox;