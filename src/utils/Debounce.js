export const debounce = (func, delay) => { //preventing it from being called on every keystroke
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}