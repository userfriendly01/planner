import React from "react";
import {
  ProfileColumnProps,
  TritonPerson,
  QmPerson,
  WfmPerson
} from "./CompareProfiles.Interfaces";
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

const ProfileColumn = (props: ProfileColumnProps) => {
  const {
    people,
    title
  } = props;

  const defaultPerson = {
    index: 0,
    ...people[0]
  };
  const [selectedProfile, setSelectedProfile] = React.useState<TritonPerson | QmPerson | WfmPerson>(defaultPerson);

  React.useEffect(() => {
    setSelectedProfile(defaultPerson);
  }, [people]);

  return (
    <ProfileColumnContainer>
      <ProfileColumnsHeaderWrapper>
        <ProfileColumnsHeader>{title}</ProfileColumnsHeader>
        <ProfileColumnWrapper>
          <ProfileColumnSideNav>
            {people.map((p: TritonPerson | QmPerson | WfmPerson, index: number) => ((
              <ProfileColumnNavOption
                key={index}
                data-testid={`user-${index}`}
                selected={selectedProfile?.index === index}
                onClick={() => setSelectedProfile({
                  index,
                  ...p,
                })}>
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
                } else if (key !== "index") {
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