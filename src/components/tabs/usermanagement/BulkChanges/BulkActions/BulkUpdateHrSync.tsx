import { UpdateWrapper } from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps
} from "../BulkChanges.Interfaces";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";
import { sortProfilesByName } from "utils";

const BulkUpdateHrSync = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    setShowTemplates,
    setUploadedForm,
    replaceTemplate,
    removeTemplate
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;

  const [selectedProfile, setSelectedProfile] = React.useState(null);

  React.useEffect(() => {
    //If the entries are valid, update/add the template to the selected templates.
    //If they arent valid, remove the template from the selected templates
    //Valid templates will drive the display of the processing buttons
    if (selectedProfile) {
      setShowTemplates(false);
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      const workers = state.workerContext.workers.filter((w: any) => w.attributes.profile_id === selectedProfile.profile_id);
      const nNumbers = workers.map((w: any, index) => {
        return {
          ["N Number"]: w.attributes?.n_number,
          rowNumber: index + 1,
          workerSid: w.sid,
          originalWorker: w
        }
      });
      console.log("FAITH! ", nNumbers);
      if (!templateFound) {
        replaceTemplate(template);
      };
      setUploadedForm(nNumbers);
    } else {
      setShowTemplates(true);
      setUploadedForm(null);
      if (selectedTemplates.find((t: Template) => t.name === template.name)) {
        removeTemplate(template);
      }
    }
  }, [selectedProfile]);

  React.useEffect(() => {
    if (selectedTemplates.length === 0) {
      setSelectedProfile(null);
    }
  }, [selectedTemplates]);

  const formatDropdownOption = (profile: any) => {
    if (typeof profile === "object") {
      return {
        ...profile,
        value: profile.profile_id,
        label: `${profile.profile_nme} - ${profile.profile_id}`
      };
    } else {
      return "";
    }
  };

  return (
    <UpdateWrapper>
      <Dropdown
        label="Triton Profile"
        value={formatDropdownOption(profiles.find((p: any) => p.profile_id === selectedProfile?.value))}
        options={profiles.sort(sortProfilesByName).map((profile: any) => formatDropdownOption(profile))}
        updateValue={(event: any, profile: any) => setSelectedProfile(profile)}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />
    </UpdateWrapper>
  );
};

export default BulkUpdateHrSync;