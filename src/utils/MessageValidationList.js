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
        case 'ofwspousebdate':
        case 'benbdate':
        case 'coborrowerspousebdate':
        case 'coborrowbdate':
        case 'benspousebdate':
            if (state === 'Invalid') {
                return 'Age should be 20 to 65 years old only';
            } else if (state === 'Empty') {
                return 'Birthdate Required';
            }
            break;

        default:
            return 'Not Valid';
    }
}

export const inputMessage = (keyName, state, compname) => {
    switch (keyName) {
        case 'Email':
            if (state === 'Invalid') {
                return 'Invalid Email Address';
            } else if (state === 'Empty') {
                return 'Email Address Required';
            }
            break;
        case 'Default':
        case 'Uppercase':
        case 'Income':
        case 'Rent_Amort':
        case 'Allotment':
            if (compname && state === 'Invalid') {
                return `Invalid ${compname}`;
            } else if (compname && state === 'Empty') {
                return `${compname} Required`;
            }
            break;

        default:
            return 'Invalid Component(No CompName / KeyName)';
    }
}