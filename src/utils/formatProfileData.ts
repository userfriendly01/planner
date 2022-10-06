import CheckIcon from '@mui/icons-material/Check';

export const formatProfileBooleanData = (number: number): any => {
    if (number === 1) {
       return CheckIcon;
    }
    return '';
};