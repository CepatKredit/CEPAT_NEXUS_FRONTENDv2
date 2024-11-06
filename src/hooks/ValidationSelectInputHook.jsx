import * as React from "react";

    export function useSelectValidation(initialValue, rendered, receive) {
        const [getStatus, setStatus] = React.useState("");
        const [getIcon, setIcon] = React.useState(false);
        let getItem = initialValue;

        const onChange = (e) => {
            getItem = e;
            setIcon(false);
            if (!e) {
                setStatus("error");
                setIcon(true);
            } else {
                setStatus("");
                setIcon(true);  
                receive(e);
            }
        };

        const onBlur = () => {
            setIcon(true);
            if (!getItem) {
                setStatus("error");
            } else {
                setStatus("");
            }
        };

        React.useEffect(() => {
            if (rendered) {
                setIcon(false);
                if (!getItem) {
                    setStatus("error");
                    setIcon(true);
                } else {
                    setStatus("");
                    setIcon(true);
                }
            }
        }, []);

        return { getStatus, getIcon, onChange, onBlur };
}