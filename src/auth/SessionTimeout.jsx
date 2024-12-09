import axios from 'axios'
import * as React from 'react'
import { useCookies } from 'react-cookie'
import { useLocation, useNavigate } from 'react-router-dom'

//hindi kasama sa logic na path
const ExemptedRoutes = ['/', '/loan-application']
export default function SessionTimeout({ children }) {

    const navigate = useNavigate()
    const location = useLocation()
    const timeoutRef = React.useRef()
    ///////////////NEW UPDATE SA REFRESH TOKEN 11/25/2024
    // const refreshTimeoutRef = React.useRef();
    // const alertTimeoutRef = React.useRef();
    // const [cookies, setCookie, removeCookie] = useCookies(['REFRESH TOKEN'])
    // const [isUserActive, setIsUserActive] = React.useState(false);

    // //trigger ko kapag hindi na gumagalaw si user
    // const checkUserActivity = () => {
    //     setIsUserActive(true);
    //     setTimeout(() => setIsUserActive(false), 10 * 1000);
    // };

    // const refreshToken = async () => {
    //     const currentRefreshToken = document.cookie
    //         .split('; ')
    //         .find(row => row.startsWith('REFRESH TOKEN='))
    //         ?.split('=')[1];
    
    //     if (!currentRefreshToken) {
    //         console.log('No refresh token found. Aborting refresh.');
    //         clearTimeout(refreshTimeoutRef.current);
    //         clearTimeout(alertTimeoutRef.current);
    //         return;
    //     }
    
    //     if (!isUserActive) {
    //         console.log('User inactive. Skipping token refresh.');
    //         return;
    //     }
    
    //     const response = await axios.post(
    //         `http://localhost:5209/api/CKFI_Portal/verify/access-token/${currentRefreshToken}?expirationInHours=20`
    //     );
    
    //     const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    //     // Store the new tokens
    //     localStorage.setItem('ACCESS TOKEN', accessToken);
    //     setCookie('REFRESH TOKEN', newRefreshToken, {
    //         secure: true,
    //         sameSite: 'strict',
    //         maxAge: 20, // Refresh token expiry in seconds
    //     });
    
    //     console.log('Token refreshed successfully.');
    
    //     // Schedule a warning alert 3 seconds before expiry
    //     alertTimeoutRef.current = setTimeout(() => {
    //         if (document.cookie.includes('REFRESH TOKEN')) {
    //             console.log('Triggering session expiry alert.');
    //             alert('Your session is about to expire.');
    //         }
    //     }, (20 - 3) * 1000); // 3 seconds before expiry
    
    //     // Schedule the next token refresh
    //     refreshTimeoutRef.current = setTimeout(refreshToken, (20 - 5) * 1000); // Refresh 5 seconds before expiry
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

    //     //user activity
    //     window.addEventListener('mousemove', checkUserActivity);
    //     window.addEventListener('keydown', checkUserActivity);

    //     // Initialize timers
    //     resetExpiryOnActivity();

    //     return () => {
    //         window.removeEventListener('mousemove', resetExpiryOnActivity);
    //         window.removeEventListener('keydown', resetExpiryOnActivity);
    //         window.removeEventListener('click', resetExpiryOnActivity);
    //         window.removeEventListener('scroll', resetExpiryOnActivity);

    //         window.removeEventListener('mousemove', checkUserActivity);
    //         window.removeEventListener('keydown', checkUserActivity);
    //         clearTimeout(timeoutRef.current);
    //         clearTimeout(refreshTimeoutRef.current);
    //     };
    // }, [location.pathname, navigate]);
    ///////////END OF THE CODE

///tunay
    /*React.useEffect(() => {
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
    }, [navigate, location.pathname])*/

    return children
}