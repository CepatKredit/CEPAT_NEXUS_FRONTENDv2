import axios from 'axios'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { useLocation, useNavigate } from 'react-router-dom'

const ExemptedRoutes = ['/', '/loan-application']
export default function SessionTimeout({ children }) {

    const navigate = useNavigate()
    const location = useLocation()
    const timeoutRef = React.useRef()
    ///////////////NEW UPDATE SA REFRESH TOKEN 11/25/2024
    // const refreshTimeoutRef = React.useRef();
    // const alertTimeoutRef = React.useRef();
    // const [cookies, setCookie, removeCookie] = useCookies(['REFRESH TOKEN'])

    // const refreshToken = async () => {
    //     try {
    //         const currentRefreshToken = document.cookie
    //             .split('; ')
    //             .find(row => row.startsWith('REFRESH TOKEN='))
    //             ?.split('=')[1];

    //             if (!currentRefreshToken) {
    //                 console.log('No refresh token found. Aborting refresh.');
    //                 clearTimeout(refreshTimeoutRef.current); // Stop scheduled refresh
    //                 clearTimeout(alertTimeoutRef.current);   // Stop alert
    //                 return; // Exit early if no refresh token
    //             }

    //         const response = await axios.post(`verify/access-token/${currentRefreshToken}?expirationInHours=20`);
    //         const { accessToken, refreshToken: newRefreshToken } = response.data;

    //         const refreshExpiresIn = 20
    //         // Update tokens
    //         localStorage.setItem('ACCESS TOKEN', accessToken);
    //         setCookie('REFRESH TOKEN', newRefreshToken, {
    //             secure: true,
    //             sameSite: 'strict',
    //             maxAge: refreshExpiresIn // Update expiry in seconds
    //         });

    //         console.log('Token refreshed successfully.');

    //         clearTimeout(refreshTimeoutRef.current);
    //         clearTimeout(alertTimeoutRef.current);

    //         // Schedule alert and next refresh
    //         alertTimeoutRef.current = setTimeout(() => {
    //             if (cookies['REFRESH TOKEN']) {
    //                 alert('Your session is about to expire.');
    //             } else {
    //                 console.log('No refresh token found. Stopping alert.');
    //                 clearTimeout(alertTimeoutRef.current); // Stop the alert
    //             }
    //         }, (refreshExpiresIn - 10) * 1000);

    //         // Set up next refresh
    //         const refreshBuffer = 5; // Time before expiry to refresh
    //         refreshTimeoutRef.current = setTimeout(refreshToken, (20 - refreshBuffer) * 1000);
    //     } catch (error) {
    //         console.error('Failed to refresh token:', error);
    //         clearSession();
    //     }
    // };

    // const clearSession = () => {
    //     console.log('Clearing session...');
    //     localStorage.clear();
    //     document.cookie.split(';').forEach(cookie => {
    //         const eqPos = cookie.indexOf('=');
    //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    //     });
    //     removeCookie('REFRESH TOKEN');
    //     clearTimeout(refreshTimeoutRef.current); // Stop scheduled refresh
    //     clearTimeout(alertTimeoutRef.current);
    //     navigate('/');
    // };

    // React.useEffect(() => {
    //     if (ExemptedRoutes.includes(location.pathname)) {
    //         clearTimeout(timeoutRef.current);
    //         clearTimeout(refreshTimeoutRef.current);
    //         return;
    //     }

    //     const resetExpiryOnActivity = () => {
    //         clearTimeout(timeoutRef.current);
    //         clearTimeout(refreshTimeoutRef.current);

    //         // Reset idle timeout
    //         timeoutRef.current = setTimeout(() => {
    //             console.log('User idle. Session ending.');
    //             clearSession();
    //         }, 20 * 1000); // 1 minute idle time

    //         // Reset token refresh timer
    //         refreshToken();
    //     };

    //     // Attach event listeners
    //     window.addEventListener('mousemove', resetExpiryOnActivity);
    //     window.addEventListener('keydown', resetExpiryOnActivity);
    //     window.addEventListener('click', resetExpiryOnActivity);
    //     window.addEventListener('scroll', resetExpiryOnActivity);

    //     // Initialize timers
    //     resetExpiryOnActivity();

    //     return () => {
    //         window.removeEventListener('mousemove', resetExpiryOnActivity);
    //         window.removeEventListener('keydown', resetExpiryOnActivity);
    //         window.removeEventListener('click', resetExpiryOnActivity);
    //         window.removeEventListener('scroll', resetExpiryOnActivity);
    //         clearTimeout(timeoutRef.current);
    //         clearTimeout(refreshTimeoutRef.current);
    //     };
    // }, [location.pathname, navigate]);
    ///////////END OF THE CODE

///tunay
    React.useEffect(() => {
        if (ExemptedRoutes.includes(location.pathname)) {
            clearTimeout(timeoutRef.current);
            return;
        }
        function handleWindowEvents() {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                localStorage.clear();
                document.cookie.split(";").forEach(cookie => {
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                });
            //     navigate('/');
            //   alert('working')
            }, 60 * 1000)
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