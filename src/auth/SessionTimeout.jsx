import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ExemptedRoutes = ['/', '/loan-application']
export default function SessionTimeout({ children }) {

    const navigate = useNavigate()
    const location = useLocation()
    const timeoutRef = React.useRef()

    React.useEffect(() => {
        if (ExemptedRoutes.includes(location.pathname)) {
            clearTimeout(timeoutRef.current);
            return;
        }
        function handleWindowEvents() {
            // clearTimeout(timeoutRef.current)
            // timeoutRef.current = setTimeout(() => {
            //     localStorage.clear();
            //     document.cookie.split(";").forEach(cookie => {
            //         const eqPos = cookie.indexOf("=");
            //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            //         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            //     });
            // //     navigate('/');
            // //   alert('working')
            // }, 60 * 1000)
        }

        window.addEventListener('mousemove', handleWindowEvents)
        window.addEventListener('keydown', handleWindowEvents)
        window.addEventListener('click', handleWindowEvents)
        window.addEventListener('scroll', handleWindowEvents)

        // handleWindowEvents()

        return () => {
            window.removeEventListener('mousemove', handleWindowEvents);
            window.removeEventListener('keydown', handleWindowEvents);
            window.removeEventListener('click', handleWindowEvents);
            window.removeEventListener('scroll', handleWindowEvents);
        }
    }, [navigate, location.pathname])

    return children
}