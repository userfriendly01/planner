import React from "react";
import {
  CallTag, FlexColumn,
  FlexRow
} from "globals/interfaces";
import {
  CallTagWrapper,
  Header1,
  IconButtonWrapper,
  FormRow
} from "./ProfileEntryForm.Styles";
import {
  Divider,
  Tooltip
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { CustomInput } from "components/core/CustomInput/CustomInput";
import {
  Add, Delete
} from "@mui/icons-material";

export const CallTagFields = () => {

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const [ callTags, setCallTags ] = React.useState(form.callTagsList);

  const styles = {
    width: "300px",
    margin: "5px 20px",
    alignSelf: "center"
  };

  return (
    <FlexColumn>
      <FormRow>
        <Header1><h2>Call Tags</h2></Header1>
        <Tooltip title={"Add Call Tag"}>
          <IconButtonWrapper onClick={() => {
            const newCallTagArray = [{
              attribute_name: "",
              display_name: "",
              options: []
            }, ...callTags ];
            setCallTags(newCallTagArray);
            setForm({
              type: profileEntryFormActions.SET_FORM_FIELD,
              payload: {
                key: "callTagsList",
                value: newCallTagArray
              }
            });
          }}>
            <Add/>
          </IconButtonWrapper>
        </Tooltip>
      </FormRow>
      <CallTagWrapper>
        { callTags.map((tag: CallTag) => {
          const currentTagIndex = callTags.findIndex((ct: CallTag) => tag.attribute_name === ct.attribute_name);
          return (
            <FlexColumn key={tag.attribute_name}>
              <Divider style={{ marginTop: "10px" }}/>
              <FlexRow style={{
                justifyContent: "space-around",
                margin: "20px",
                alignItems: "center",
                alignSelf: "center"
              }}>
                <CustomInput
                  label={"Call Tag Name *"}
                  name={"Call Tag Name *"}
                  styles={styles}
                  updateValue={value => {
                    const newArray = callTags.slice();
                    newArray[currentTagIndex] = {
                      ...callTags[currentTagIndex],
                      display_name: value
                    };
                    setCallTags(newArray);
                  }}
                  onBlur={() =>  setForm({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "callTagsList",
                      value: callTags
                    }
                  })}
                  value={callTags[currentTagIndex]?.display_name}
                />
                <CustomInput
                  label={"Call Tag Variable *"}
                  name={"Call Tag Variable *"}
                  styles={styles}
                  updateValue={value => {
                    const newArray = callTags.slice();
                    newArray[currentTagIndex] = {
                      ...callTags[currentTagIndex],
                      attribute_name: value
                    };
                    setCallTags(newArray);
                  }}
                  value={callTags[currentTagIndex]?.attribute_name}
                  onBlur={() => setForm({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "callTagsList",
                      value: callTags
                    }
                  })}
                />
                <Tooltip title={"Remove Call Tag"}>
                  <IconButtonWrapper onClick={() => {
                    const newArray = callTags.slice();
                    newArray.splice(currentTagIndex, 1);
                    setCallTags(newArray);
                    setForm({
                      type: profileEntryFormActions.SET_FORM_FIELD,
                      payload: {
                        key: "callTagsList",
                        value: newArray
                      }
                    }); }
                  }><Delete/></IconButtonWrapper>
                </Tooltip>
              </FlexRow>
              <FormRow>
                <Tooltip title={"Add Call Tag Option"}>
                  <IconButtonWrapper onClick={() => {
                    const existingOptions = callTags[currentTagIndex].options;
                    const newArray = callTags.slice();
                    const newOptions = existingOptions ? ["", ...existingOptions] : [""];
                    newArray[currentTagIndex] = {
                      ...callTags[currentTagIndex],
                      options: newOptions
                    };
                    setCallTags(newArray);
                    setForm({
                      type: profileEntryFormActions.SET_FORM_FIELD,
                      payload: {
                        key: "callTagsList",
                        value: newArray
                      }
                    }); }
                  }><Add/></IconButtonWrapper>
                </Tooltip>
              </FormRow>
              {tag.options?.map((o: string) => {
                const currentOptionIndex = tag.options.findIndex((op: string) => op === o);
                const value = callTags[currentTagIndex]?.options[currentOptionIndex];
                return (
                  <FormRow key={o}>
                    <CustomInput
                      label={"Option *"}
                      name={"Option *"}
                      styles={styles}
                      updateValue={value => {
                        const newOptions = tag.options.slice();
                        newOptions[currentOptionIndex] = value;
                        const newArray = callTags.slice();
                        newArray[currentTagIndex] = {
                          ...callTags[currentTagIndex],
                          options: newOptions
                        };
                        setCallTags(newArray);
                      }}
                      onBlur={() => setForm({
                        type: profileEntryFormActions.SET_FORM_FIELD,
                        payload: {
                          key: "callTagsList",
                          value: callTags
                        }
                      })}
                      value={value}
                    />
                    <Tooltip title={"Remove Call Tag Option"}>
                      <IconButtonWrapper onClick={() => {
                        const newArray = callTags.slice();
                        const newOptions = newArray[currentTagIndex].options.slice();
                        newOptions.splice(currentOptionIndex, 1);
                        newArray[currentTagIndex] = {
                          ...callTags[currentTagIndex],
                          options: newOptions
                        };
                        setCallTags(newArray);
                        setForm({
                          type: profileEntryFormActions.SET_FORM_FIELD,
                          payload: {
                            key: "callTagsList",
                            value: newArray
                          }
                        }); }
                      }>
                        <Delete/>
                      </IconButtonWrapper>
                    </Tooltip>
                  </FormRow>
                );
              })
              }
            </FlexColumn>
          );
        })
        }
      </CallTagWrapper>
    </FlexColumn>
  );
};