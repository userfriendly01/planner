import React from "react";
import {
  ProfileColumnContainer,
  ProfileColumnsHeader,
  ProfileColumnsHeaderWrapper,
  ProfileColumnWrapper,
  ProfileColumnDetails,
  ProfileColumnSideNav,
  ProfileColumnNavOption,
  Attribute,
  Key,
  ProfileValue
} from "./CompareProfiles.Styles";
import { Person, PersonOutline } from "@mui/icons-material";
import { Divider } from "@mui/material";

const ProfileColumn = (props: any) => {
  const {
    people,
    title
  } = props;
  //pass in an array of objects
  const [selectedProfile, setSelectedProfile] = React.useState<any>({});

  React.useEffect(() => {
    setSelectedProfile(people[0]);
  }, [people]);
  return (
    <ProfileColumnContainer>
      <ProfileColumnsHeaderWrapper>
        <ProfileColumnsHeader>{title}</ProfileColumnsHeader>
        <ProfileColumnWrapper>
          <ProfileColumnSideNav>
            {people.map((p: any) => ((
              <ProfileColumnNavOption
                key={p.id}
                selected={selectedProfile?.id === p.id}
                onClick={() => setSelectedProfile(p)}>
                {p.Active ? <Person style={{ font: "20px" }} /> : <PersonOutline />}
              </ProfileColumnNavOption>
            )))
            }
          </ProfileColumnSideNav>
          <ProfileColumnDetails>
            {selectedProfile &&
              Object.keys(selectedProfile).map((key: string) => {
                if (key === "Active") {
                  if (selectedProfile[key]) {
                    return (
                      <Attribute>
                        <Key>Active</Key>
                        <Divider flexItem style={{ width: "80%", margin: "5px 0px", alignSelf: "center" }} />
                      </Attribute>
                    )
                  } else {
                    return (
                      <Attribute>
                        <Key>Inactive</Key>
                        <Divider flexItem style={{ width: "80%", margin: "5px 0px", alignSelf: "center" }} />
                      </Attribute>
                    )
                  }
                } else {
                  return (
                    <Attribute>
                      <Key>{key}</Key>
                      <ProfileValue>{selectedProfile[key]}</ProfileValue>
                      <Divider flexItem style={{ width: "80%", margin: "5px 0px", alignSelf: "center" }} />
                    </Attribute>
                  )
                }
              })
            }
          </ProfileColumnDetails>
        </ProfileColumnWrapper>
      </ProfileColumnsHeaderWrapper>
    </ProfileColumnContainer>
  )
};

export default ProfileColumn;