import React from "react";
import {
  OrgWrapper,
  GroupColumn,
  TeamColumn,
  Group,
  Team
} from "./CalabrioOrgWrapper.Styles";
import { useAdminState } from "context/appContext";
import { sortCalabrioObject } from "utils/sortUtils";
import { Divider } from "@mui/material";
import { CalabrioGroup } from "usermanagement/CallRecording.Interfaces";

const CalabrioOrgWrapper = () => {
  const state = useAdminState();
  const groups = state.calabrioContext.groups;
  const teams = state.calabrioContext.teams;

  const [selectedGroup, setSelectedGroup] = React.useState(groups[0]);

  return (
    <OrgWrapper>
      <GroupColumn>
        {groups.sort(sortCalabrioObject).map((g: any) => ((
          <div key={g.groupId}>
            <Group
              selected={g.groupId === selectedGroup.groupId}
              onClick={() => setSelectedGroup(g)}>
              {g.name}
            </Group>
            <Divider />
          </div>
        )
        ))
        }
      </GroupColumn>
      <TeamColumn>
        {teams.filter((t: CalabrioGroup) => t.parentGroupId === selectedGroup.groupId).sort(sortCalabrioObject).map((t: any) => ((
          <Team key={t.groupId}>
            {t.name}
          </Team>
        )))
        }
      </TeamColumn>
    </OrgWrapper>
  );
};

export default CalabrioOrgWrapper;