import React from "react";

const getWindowsDimension = () => {
    const { innerWidth, innerHeight } = window;
    const { clientWidth, clientHeight } = document.documentElement;

    return {
        screenWidth: Math.min(innerWidth, clientWidth),
        screenHeight: Math.min(innerHeight, clientHeight),
    };
};

export const useWindowDimensions = () => {
    const [windowsDimensions, setWindowsDimensions] = React.useState(getWindowsDimension());

    React.useEffect(() => {
        const handleResize = () => {
            setWindowsDimensions(getWindowsDimension());
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowsDimensions;
}