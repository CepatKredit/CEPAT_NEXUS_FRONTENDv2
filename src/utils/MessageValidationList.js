export const dateMessage = (keyName, state) => {
    console.log(keyName, state);
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