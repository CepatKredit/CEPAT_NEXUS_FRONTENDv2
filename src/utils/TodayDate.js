
export const GetToday = (controller) => {
    let today = new Date()
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    let holder = '';
    if (controller === 'MM/DD/YYYY') {
        holder = `${month}/${date}/${year}`
    }
    else if (controller === 'YYYY/MM/DD') {
        holder = `${year}/${month}/${date}`
    }
    else {
        holder = `${("00" + hours).slice(-2)}:${("00" + minutes).slice(-2)}`
    }

    return holder;
}