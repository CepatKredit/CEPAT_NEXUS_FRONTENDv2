
function FormatWithComma(num) { //Comma
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
    return parts.join('.');
}

export function FormatCurrency(num) { //Comma and Decimal
    const dec = parseFloat(num.replaceAll(',','')).toFixed(2)
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

export const DateFormat = (date) => {
    const cleaned = date.replace(/\D+/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
}

export const Uppercase = (container) => {
    if (container) {
        const text = container;
        return text.toUpperCase();
    }
}

export const inputFormat = (format, input) => {
    if (format === 'Currency') {
        const result =input? input.toString().replace(/[^0-9.]/g, '') : ''; //number only
        const res = DecimalLimit(result); //decimal trigger
        return (FormatWithComma(res ? res.replaceAll(',', '') : '')); //format with comma(s)
    } else {
        return input;
    }
}