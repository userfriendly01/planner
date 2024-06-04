import React from "react";
import {
  RolesWrapper,
  RolesColumn,
  PermissionsColumn,
  Role,
  Permission
} from "./CalabrioRolesWrapper.Styles";
import { useAdminState } from "context/appContext";
import { sortCalabrioObject } from "utils/sortUtils";
import { Divider } from "@mui/material";

const CalabrioRolesWrapper = () => {
  const state = useAdminState();
  const roles = state.calabrioContext.roles;

  const [selectedRole, setSelectedRole] = React.useState(roles[0]);

  return (
    <RolesWrapper>
      <RolesColumn>
        {roles.sort(sortCalabrioObject).map((r: any) => ((
          <div key={r.id}>
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
          <Permission key={p.name}>
            {p.name}
          </Permission>
        )))
        }
      </PermissionsColumn>
    </RolesWrapper>
  );
};

export default CalabrioRolesWrapper;