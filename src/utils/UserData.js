import { toDecrypt } from "./Converter"
 
export const GetData = (controller) => {
    let holder = toDecrypt(localStorage.getItem('USRDT'))
    if (localStorage.getItem('USRDT') === undefined || localStorage.getItem('USRDT') === null || localStorage.getItem('USRDT').length <= 0) { return null }
    else {
        let value = holder.split('?')
        if (controller === 'DEPARTMENT') { return value[0] }
        else if (controller === 'ROLE') { return value[1] }
        else { return value[2] }
    }
}