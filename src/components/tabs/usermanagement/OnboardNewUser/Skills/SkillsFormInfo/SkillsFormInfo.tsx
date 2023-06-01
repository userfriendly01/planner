import { DefaultSkillSelector } from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SkillsFormInfo = () => {

  const form = useFormState();
  const setForm = useFormDispatch();
  const [expanded, setExpanded] = useState(true);

  return(
    <Accordion expanded={expanded} onChange={()=>setExpanded(!expanded)} sx={{
      width: "384px",
      margin: "8px 0px 5px 0px",
      overflow: "overlay"
    }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >Default Skill Profile (Optional)
      </AccordionSummary>
      <AccordionDetails>
        <DefaultSkillSelector
          defaultSkills={form.triton.defaultSkills}
          setDefaultSkills={(defaultSkills: any) => {
            setForm({
              type: userFormActions.UPDATE_DEFAULT_SKILLS,
              payload: defaultSkills
            });
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default SkillsFormInfo;