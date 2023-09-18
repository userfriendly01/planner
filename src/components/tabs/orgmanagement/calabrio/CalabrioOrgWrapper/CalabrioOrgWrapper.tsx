import React from "react";
import {
  OrgWrapper,
  GroupColumn,
  TeamColumn,
  Group,
  Team
} from "./CalabrioOrgWrapper.Styles"
import { useAdminState } from "context";
import { sortCalabrioObject } from "utils";
import { Divider } from "@mui/material";
import { CalabrioGroup } from "components";

const CalabrioOrgWrapper = () => {
  const state = useAdminState();
  const groups = state.calabrioContext.groups;
  const teams = state.calabrioContext.teams;

  const [selectedGroup, setSelectedGroup] = React.useState(groups[0]);

  return (
    <OrgWrapper>
      <GroupColumn>
        {groups.sort(sortCalabrioObject).map((g: any) => ((
          <div>
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
          <Team>
            {t.name}
          </Team>
        )))
        }
      </TeamColumn>
    </OrgWrapper>
  )
};

export default CalabrioOrgWrapper;