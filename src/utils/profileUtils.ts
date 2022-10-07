export const formatProfileBooleanData = (number: number): any => {
    if (number === 1) {
       return 'true';
    }
    return 'false';
};

export const profileSettingsViews = [
    {
        value: "PROFILE_DIRECTORY",
        label: "Profile Directory"
    },
    {
        value: "PROFILE_SETTINGS",
        label: "Profile Settings"
    }
];
