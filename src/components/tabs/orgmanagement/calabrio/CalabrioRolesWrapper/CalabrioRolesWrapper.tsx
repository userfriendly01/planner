import React from "react";
import {
  RolesWrapper,
  RolesColumn,
  PermissionsColumn,
  Role,
  Permission
} from "./CalabrioRolesWrapper.Styles"
import { useAdminState } from "context";
import { sortCalabrioObject } from "utils";
import { Divider } from "@mui/material";

const CalabrioRolesWrapper = () => {
  const state = useAdminState();
  const roles = state.calabrioContext.roles;

  const [selectedRole, setSelectedRole] = React.useState(roles[0]);

  return (
    <RolesWrapper>
      <RolesColumn>
        {roles.sort(sortCalabrioObject).map((r: any) => ((
          <div>
            <Role
              selected={r.id === selectedRole.id}
              onClick={() => setSelectedRole(r)}>{r.name}
            </Role>
            <Divider />
          </div>
        )))
        }
      </RolesColumn>
      <PermissionsColumn>
        {selectedRole.permissions?.sort(sortCalabrioObject).map((p: any) => ((
          <Permission>
            {p.name}
          </Permission>
        )))
        }
      </PermissionsColumn>
    </RolesWrapper>
  )
};

export default CalabrioRolesWrapper;