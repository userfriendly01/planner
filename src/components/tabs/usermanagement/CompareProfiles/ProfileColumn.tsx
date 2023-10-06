import React from "react";
import {
  ProfileColumnWrapper,
  ProfileColumnDetails,
  ProfileColumnSideNav,
  ProfileColumnNavOption,
  ProfileAttribute,
  ProfileKey,
  ProfileValue
} from "./CompareProfiles.Styles";
import { Person, PersonOutline } from "@mui/icons-material";

const ProfileColumn = (props: any) => {
  const {
    people = []
  } = props;
  //pass in an array of objects
  const [selectedProfile, setSelectedProfile] = React.useState<any>({});
  console.log("PEOPLE OBJECTS", people);
  console.log(selectedProfile);

  React.useEffect(() => {
    setSelectedProfile(people[0]);
  }, []);
  return (
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
          Object.keys(selectedProfile).map((key: string) => ((
            <ProfileAttribute>
              <ProfileKey>{key}</ProfileKey>:<ProfileValue>{selectedProfile[key]}</ProfileValue>
            </ProfileAttribute>
          )))
        }
      </ProfileColumnDetails>
    </ProfileColumnWrapper>
  )
};

export default ProfileColumn;