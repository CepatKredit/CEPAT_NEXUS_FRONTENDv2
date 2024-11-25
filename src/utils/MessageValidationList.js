export const dateMessage = (keyName, state) => {
    switch (keyName) {
        case 'ContractDate':
            if (state === 'Invalid') {
                return 'Invalid Contract Date';
            } else if (state === 'Empty') {
                return 'Contract Date Required';
            }
            break;

        case 'ofwDeptDate':
        case 'loanDateDep':
            if (state === 'Invalid') {
                return 'Invalid Departure Date';
            } else if (state === 'Empty') {
                return 'Departure Date Required';
            }
            break;

        case 'ofwbdate':
        case 'benbdate':
        case 'coborrowbdate':
            if (state === 'Invalid') {
                return 'Age should be 20 to 65 years old only';
            } else if (state === 'Empty') {
                return 'Birthdate Required';
            }
            break;
        case 'ofwspousebdate':
        case 'coborrowerspousebdate':
        case 'benspousebdate':
            if (state === 'Invalid') {
                return 'Age should be 20 to 65 years old only';
            } else if (state === 'Empty') {
                return 'Spouse Birthdate Required';
            }
            break;
        default:
            return 'Not Valid';
    }
}

export const inputMessage = (group, state, comp_name) => {
    switch (group) {
        case 'Email'://
        case 'Default'://
        case 'Uppercase'://
        case 'Income'://
        case 'Rent_Amort'://
            if (comp_name && state === 'Invalid') {
                return `Invalid ${comp_name}`;
            } else if (comp_name && state === 'Empty') {
                return `${comp_name} Required`;
            }
            break;

        default:
            return 'Invalid Component(No CompName / KeyName)';
    }
}