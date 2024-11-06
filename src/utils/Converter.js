import CryptoJS from "crypto-js"
import dayjs from "dayjs"

export const ChangeText = (container) => {
    if (container) {
        var txt = txt = container.split('!').join('[0021]')
        txt = txt.split('"').join('[0022]')
        txt = txt.split('#').join('[0023]')
        txt = txt.split('$').join('[0024]')
        txt = txt.split('%').join('[0025]')
        txt = txt.split('&').join('[0026]')
        txt = txt.split("'").join('[0027]')
        txt = txt.split('(').join('[0028]')
        txt = txt.split(')').join('[0029]')
        txt = txt.split('*').join('[002A]')
        txt = txt.split('+').join('[002B]')
        txt = txt.split(',').join('[002C]')
        txt = txt.split('-').join('[002D]')
        txt = txt.split('.').join('[002E]')
        txt = txt.split('/').join('[002F]')
        txt = txt.split(':').join('[003A]')
        txt = txt.split(';').join('[003B]')
        txt = txt.split('<').join('[003C]')
        txt = txt.split('=').join('[003D]')
        txt = txt.split('>').join('[003E]')
        txt = txt.split('?').join('[003F]')
        txt = txt.split('^').join('[005E]')
        txt = txt.split('`').join('[0060]')
        return txt;
    }
}

export const ReturnText = (container) => {
    if (container) {
        var txt = container.split('[0021]').join('!')
        txt = txt.split('[0022]').join('"')
        txt = txt.split('[0023]').join('#')
        txt = txt.split('[0024]').join('$')
        txt = txt.split('[0025]').join('%')
        txt = txt.split('[0026]').join('&')
        txt = txt.split('[0027]').join("'")
        txt = txt.split('[0028]').join('(')
        txt = txt.split('[0029]').join(')')
        txt = txt.split('[002A]').join('*')
        txt = txt.split('[002B]').join('+')
        txt = txt.split('[002C]').join(',')
        txt = txt.split('[002D]').join('-')
        txt = txt.split('[002E]').join('.')
        txt = txt.split('[002F]').join('/')
        txt = txt.split('[003A]').join(':')
        txt = txt.split('[003B]').join(';')
        txt = txt.split('[003C]').join('<')
        txt = txt.split('[003D]').join('=')
        txt = txt.split('[003E]').join('>')
        txt = txt.split('[003F]').join('?')
        txt = txt.split('[005E]').join('^')
        txt = txt.split('[0060]').join('`')
        return txt;
    }
}

export const toUpperText = (container) => {
    if (container) {
        const text = container;
        return text.toUpperCase();
    }
}

export const toEncrypt = (container) => {
    if (container) {
        const data = CryptoJS.AES.encrypt(container, import.meta.env.VITE_SECRET_KEY).toString();
        return data;
    }
}

export const toDecrypt = (container) => {
    if (container) {
        try {
            const data = CryptoJS.AES.decrypt(container, import.meta.env.VITE_SECRET_KEY).toString(CryptoJS.enc.Utf8)
            return data;
        }
        catch (error) {
            console.error("Decryption failed: ", error.message);
        }
    }
}

export const mmddyy = (date) => {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, day, year].join('-');
    }
}

export const yymmdd = (date) => {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
}

export const base64toBlob = (data) => {
    if (data) {
        const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
        var blob = new Blob([out], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    }
}

export const convToCurrency = (num) => {
    function formatCommas(num1) {
        if (!num1) return '';
        const parts = num1.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    function formatDecimal(num2) {
        if (!num2) return '';
        return parseFloat(num2).toFixed(2);
    }
    return formatCommas(formatDecimal(num));
}