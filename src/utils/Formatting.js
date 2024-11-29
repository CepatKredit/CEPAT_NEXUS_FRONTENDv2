import dayjs from "dayjs";

function FormatWithComma(num) { //Comma
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
    return parts.join('.');
}

export function FormatComma(num) {
    return FormatWithComma(num);
}

export function FormatCurrency(num) { //Comma and Decimal
    const dec = parseFloat(num.replaceAll(',', '')).toFixed(2)
    const parts = dec.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
    return parts.join('.');
}

function DecimalLimit(number) { //1 decimal and 2 digit after decimal
    let num = number;
    const periodCount = num.split('.').length - 1;
    if (periodCount > 1) {
        num = num.slice(0, -1);
    } else if (periodCount === 1) {
        const parts = num.split('.');
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
        }
        num = parts.join('.');
    }
    return num;
}

export const disableDate_deployment = (current) =>{
    return current && current < dayjs().startOf('day');
};

export const DateFormat = (date) => {
    const cleaned = date.replace(/\D+/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
}

export const Uppercase = (container) => {
    if (container) {
        const text = String(container); // Ensure the value is converted to a string
        return text ? text.toUpperCase() : '';
    }
    return ''; // Handle the case where container is undefined or null
};

export const inputFormat = (format, input) => {
    if (format === 'Currency') {
        const result = input ? input.toString().replace(/[^0-9.]/g, '') : ''; //number only
        const res = DecimalLimit(result); //decimal trigger
        return (FormatWithComma(res ? res.replaceAll(',', '') : '')); //format with comma(s)
    }else if (format === '+639') {
        if (!input.startsWith('+639')) {
            input = '+639';
        }
        const sanitizedInput = input.slice(4).replace(/[^0-9]/g, ''); 
        return `+639${sanitizedInput}`;
    }else if(format === 'Http'){
        if(!input.startsWith('https://www.facebook.com/')) {
            input = 'https://www.facebook.com/'
        }
        const res = input.slice(25);
        return `https://www.facebook.com/${res}`;
    } else {
        return input;
    }
}


export const CharacterLimit = (Group, Format) => { //Decimal places will be disregard
    switch (Group) {
        case 'ContactNo':
            if (Format === '+639') return 13;
            else if (Format === '09') return 11;
        case 'Rent_Amort':
        case 'Income':
        case 'Amount-30,000':
            return 10; // till 99,999,999
        case 'Number':
            return 2;
        case 'Email':
        case 'Uppercase':
        case 'Default':
            return 80; // freehand Name/Email.. etc.
        default:
            return 250; //If not declared
    }
}