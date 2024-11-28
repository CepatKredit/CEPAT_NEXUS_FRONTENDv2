export const debounce = (func, delay) => { //preventing it from being called on every keystroke
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
export function debouncef(func) {
    let timeout;

    function debounced(...args) {
        const delay = args[args.length - 1]; // Last argument is the custom delay
        if (timeout) {
            clearTimeout(timeout); // Clear the existing timer
        }

        // Start a new timer
        timeout = setTimeout(() => {
            timeout = null; // Reset timeout once the function is executed
            func(...args.slice(0, -1)); // Call function with all arguments except delay
        }, delay); // Use the passed custom delay
    }

    // Allow immediate execution on cancel
    debounced.cancel = () => {
        if (timeout) clearTimeout(timeout); // Clear the timer
        timeout = null; // Reset timeout state
    };

    return debounced;
}