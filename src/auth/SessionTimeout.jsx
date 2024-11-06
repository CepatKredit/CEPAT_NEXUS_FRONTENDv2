import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ExemptedRoutes = ['/', '/loan-application']
export default function SessionTimeout({ children }) {

    const navigate = useNavigate()
    const location = useLocation()
    const timeoutRef = React.useRef()

    React.useEffect(() => {
        if (ExemptedRoutes.includes(location.pathname)) return;
        function handleWindowEvents() {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
              // alert('working')
            }, 60 * 1000)
        }

        window.addEventListener('mousemove', handleWindowEvents)
        window.addEventListener('keydown', handleWindowEvents)
        window.addEventListener('click', handleWindowEvents)
        window.addEventListener('scroll', handleWindowEvents)

        handleWindowEvents()

        return () => {
            window.removeEventListener('mousemove', handleWindowEvents);
            window.removeEventListener('keydown', handleWindowEvents);
            window.removeEventListener('click', handleWindowEvents);
            window.removeEventListener('scroll', handleWindowEvents);
        }
    }, [navigate, location.pathname])

    return children
}
