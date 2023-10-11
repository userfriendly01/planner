export const messageConsts = {
  DEV_MESSAGE: `Oh Hi there. This page is meant to compare and correct profiles across Triton, Calabrio QM, and Calabrio WFM. 
  Calabrio WFM is in Production only and Calabrio QM Non Prod should only be alighned in the Test environment with your Test Triton Worker.
  For this reason, this functionality is not used in this environment`,
  TEST_MESSAGE: `Oh Hi there. This page is meant to compare and correct profiles across Triton, Calabrio QM, and Calabrio WFM. 
  Calabrio WFM is in Production only so you wont see that column in this environment.`,
  MULTIPLE_TRITON_PROFILES: `It looks like this user has multiple Triton profiles. It's not recommended you use this functionality until you deactivate profiles you dont need, leaving one master Triton profile for this environment.`,
  MISSING_TRITON_PROFILE: `It looks like this user has no Triton profiles. A Triton profile is needed to align with Calabrio WM and Calabrio WFM`,
  MISSING_CALABRIO_MASTER_PROFILE: `There is no Calabrio QM Profile, Active or Deactive with a matching Triton Worker Sid that's synchronized. That is.. weird. I'd delete this Triton user and create a fresh one`,
  ERROR: `An Error was thrown trying to fetch this users profiles`,
  WFM_NO_PROFILE_FOUND: `No Work Force Management (WFM) Person was found with that nNumber set as its Employment Number.
  This could mean there is no WFM Person or their record Employment Number is not equal to their nNumber and needs correction`,
  WFM_MULTIPLE_PROFILES: `More than one WFM profile was found with this nNumber. Please correct this before proceeding. `,
};