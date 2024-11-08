import React from "react";
import {
  CallTag, FlexColumn
} from "globals/interfaces";
import {
  OptionsWrapper,
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
  profileEntryFormState,
  useAdminState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { CustomInput } from "components/CustomInput";
import {
  Add, Delete
} from "@mui/icons-material";
import { Dropdown } from "components/Dropdown";
import { formatDropdownOptions } from "utils/_formatUtils";

export const CallTagFields = () => {

  const callTagOptions = useAdminState().profileContext.calltags;
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
      <FormRow style={{
        width: "20%",
        marginTop: "50px",
        height: "10px"
      }}>
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
      <FormRow>Add options if you want the calltag to have a dropdown vs an open text field.</FormRow>
      { callTags.map((tag: CallTag, currentTagIndex: number) => {
        return (
          <FlexColumn key={`tag-${currentTagIndex}`}>
            <Divider/>
            <FormRow style={{ width: "45%" }}>
              <Dropdown
                label="CallTags"
                value={formatDropdownOptions([tag], "display_name", "attribute_name")[0]}
                options={formatDropdownOptions(callTagOptions, "display_name", "attribute_name")}
                updateValue={(e:any, value: any) => {
                  const newArray = callTags.slice();
                  newArray[currentTagIndex] = {
                    ...tag,
                    display_name: value.display_name,
                    attribute_name: value.attribute_name
                  };
                  setCallTags(newArray);
                  setForm({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "callTagsList",
                      value: newArray
                    }
                  });
                }}
                styles={styles}
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
            </FormRow>
            <FormRow style={{ margin: "0" }}>
              <Tooltip title={"Add Call Tag Option"}>
                <IconButtonWrapper onClick={() => {
                  const existingOptions = callTags[currentTagIndex].options;
                  const newArray = callTags.slice();
                  const newOptions = existingOptions.length ? ["", ...existingOptions] : [""];
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
            <OptionsWrapper>
              {tag.options?.map((o: string, currentOptionIndex: number) => {
                return (
                  <FormRow key={`option-${currentTagIndex}-${currentOptionIndex}`} style={{ width: "30%" }}>
                    <CustomInput
                      label={"Dropdown Option *"}
                      name={"Dropdown Option *"}
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
                      value={o}
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
            </OptionsWrapper>
          </FlexColumn>
        );
      })
      }
    </FlexColumn>
  );
};