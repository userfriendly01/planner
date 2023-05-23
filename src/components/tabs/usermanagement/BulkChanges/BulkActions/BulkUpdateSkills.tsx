import { UpdateWrapper } from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps,
  WorkerAttribute
} from "../BulkChanges.Interfaces";
import { availableAttributes } from "../BulkTemplates";
import {
  CustomInput,
  Dropdown,
  DefaultSkillSelector
} from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import React from "react";

const BulkUpdateSkills = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  console.log("BulkdUpdateForm - selectedTemplates", selectedTemplates);

  const form = useFormState();

  return (
    <>
      <DefaultSkillSelector
        defaultSkills={form.defaultSkills}
        setDefaultSkills={(defaultSkills: any) => {
          console.log("setting default skills right hurr");
        }}
      />
    </>
  );
};