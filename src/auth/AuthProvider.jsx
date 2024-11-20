import { viewResetPasswordModal } from "@hooks/ModalController"
import { DisplayOTP } from "@hooks/OTPController"
import { useMutation } from "@tanstack/react-query"
import { toEncrypt } from "@utils/Converter"
import { decode } from "@utils/Secure"
import { notification } from "antd"
import axios from "axios"
import React from "react"
import { useCookies } from "react-cookie"

const AuthContext = React.createContext(undefined)

export function useAuth() {
    const authContect = React.useContext(AuthContext)
    if (!authContect) {
        throw new Error('useAuth must be within a AuthProvider')
    }

    return authContect
}

export function AuthProvider({ children }) {
    const [token, setToken] = React.useState()
    const [getAccount, setAccount] = React.useState({
        Username: '',
        Password: ''
    })
    const [api, contextHolder] = notification.useNotification();
    const [cookies, setCookie, removeCookie] = useCookies(['SESSION_ID'])
    const [getAccessList, setAccessList] = React.useState();

    const getOTPStatus = DisplayOTP((state) => state.modalStatus)
    const setOTPStatus = DisplayOTP((state) => state.setStatus)
    const getModalResetStatus = viewResetPasswordModal(
        (state) => state.modalStatus
      );
      const setModalResetStatus = viewResetPasswordModal(
        (state) => state.setStatus
      );
      const setAccountId = viewResetPasswordModal((state) => state.setId);

    const logout = () => {
        removeCookie('SESSION_ID');
        localStorage.removeItem('UTK');
        localStorage.removeItem('UPTH');
        localStorage.removeItem('PTH');
        localStorage.removeItem('SP');
        localStorage.removeItem('USRFN');
        localStorage.removeItem('USRDT');
        localStorage.removeItem('SIDC');
        localStorage.removeItem('activeTab');
        localStorage.removeItem('ACCESS TOKEN');
        setToken(null);
        setAccessList(null); 
        setAccount({
            Username: '',
            Password: ''
        })
    };


    const onClickLogin = useMutation({
        mutationFn: async (navigate) => {
            if (getAccount.Username === '' || getAccount.Password === '') {
                api['info']({
                    message: 'Invalid input',
                    description: 'Please input your username and password to login.'
                })
            }
            else {
                await axios.post('/login', getAccount)
                    .then(result => {
                        console.log((decode(result.data.userData.password) === getAccount.Password))
                        console.log("Received response:", result.data);
                        if (result.data.message === 'Account not found' ||
                            result.data.message === 'Account disabled' ||
                            result.data.message === 'Account for approval' ||
                            result.data.message === 'Account rejected'
                        ) {
                            api[result.data.status]({
                                message: result.data.message,
                                description: result.data.description
                            })
                        }
                        else {
                            if (decode(result.data.userData.password) === getAccount.Password) {
                                PasswordMatch.mutate(navigate)
                                // resetAppDetails(); 
                            }
                            else {
                                PasswordNotMatch.mutate()
                            }
                        }
                    })
                    .catch(error => {
                        api['error']({
                            message: 'Something went wrong',
                            description: error.message
                        })
                    })
            }
        }
    })

    const PasswordMatch = useMutation({
        mutationFn: async (navigate) => {
            await axios.post('/verifiedAccount', getAccount)
                .then((result) => {
                    if (result.data.status === 'warning') {
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                    }
                    else if (result.data.status === 'info') {
                        setModalResetStatus(true)
                        const data = {
                            id: result.data.container.id,
                            username: result.data.container.username,
                            password: getAccount.Password
                        }
                        setAccountId(data)
                        setAccount({
                            Username: '',
                            Password: ''
                        })
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                    }
                    else {
                        let AccessPath = ''
                        result.data.access?.map((x) => {
                            if (AccessPath === '') {
                                AccessPath += x.accessPath
                            }
                            else {
                                AccessPath += ',' + x.accessPath
                            }
                        })

                        if (result.data.department === 'LC') {
                            axios.post(
                              `verify/access-token/${result.data.eeyyy}?expirationInHours=60`
                            )
                            .then(function (response) {
                                const accessToken = response.data.accessToken;
                                const refreshToken = response.data.refreshToken;
                                const refreshExpiresIn = response.data.refreshExpiresIn; // In seconds
                          
                                // Store tokens
                                localStorage.setItem("ACCESS TOKEN", accessToken);
                                setCookie("REFRESH TOKEN", refreshToken, {
                                  secure: true,
                                  sameSite: "strict",
                                  maxAge: refreshExpiresIn, // Expiration in seconds
                                });
                          
                                // Alert before the cookie expires (5 seconds before expiration for demonstration)
                                // const alertBeforeExpiry = 5; // Adjust the time before expiry to show alert (in seconds)
                                // const alertTimeout = (refreshExpiresIn - alertBeforeExpiry) * 1000; // Convert to milliseconds
                          
                                // setTimeout(() => {
                                //   alert("Your session is about to expire. Please refresh or re-login.");
                                // }, alertTimeout);
                            })
                            .catch(function (error) {
                              console.error(error);
                              throw new Error("Token generation failed.");
                            });
                            localStorage.setItem('UTK', result.data.eeyyy);
                            localStorage.setItem('UPTH', toEncrypt(AccessPath));
                            localStorage.setItem('SP', '/ckfi/dashboard')
                            localStorage.setItem('USRFN', toEncrypt(result.data.fn));
                            localStorage.setItem('USRDT', toEncrypt(`${result.data.department}?${result.data.role}?${result.data.branch}`));
                            if(navigate) {
                                navigate('/ckfi/dashboard')
                            }
                            setCookie('SESSION_ID', result.data.eeyyy, { secure: true, sameSite: 'strict' });
                            api[result.data.status]({
                                message: result.data.message,
                                description: result.data.description
                            })
                        }
                        else {
                            setAccessList(AccessPath)
                            setOTPStatus(true)
                        }
                    }
                })
                .catch(error => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })

    const PasswordNotMatch = useMutation({
        mutationFn: async () => {
            await axios.post('/passwordAttempt', getAccount)
                .then((result) => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                })
                .catch(error => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })


    React.useEffect(() => {
        function fetchToken() {
            const tkn = localStorage.getItem('UTK')
            setToken(tkn)
        }
        fetchToken()
    }, [])

    React.useLayoutEffect(() => {
        const authInterceptor = axios.interceptors.request.use((config) => {
            config.headers.Authorization =
                !config._retry && token
                    ? `Bearer ${token}`
                    : config.headers.Authorization
            return config
        })

        return () => {
            axios.interceptors.request.eject(authInterceptor)
        }
    }, [token])

    React.useLayoutEffect(() => {
        const refreshIntercepter = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const orignalRequest = error.config
                if (error.response.status === 403 && error.response.data.message === 'Unauthorized') {
                    //MUST CONTAINS REFRESH TOKEN
                    setToken()
                    orignalRequest.header.Authorization = `Bearer ${''}`
                    orignalRequest._retry = true
                    return axios(orignalRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.response.eject(refreshIntercepter)
        }
    }, [])

    return (
        <AuthContext.Provider
        value={{
            token,
            getAccount,
            setAccount,
            getAccessList,
            setAccessList,
            onClickLogin,
            PasswordMatch,
            PasswordNotMatch,
            setOTPStatus,
            getOTPStatus,
            setCookie,
            logout,
            getModalResetStatus,
            setModalResetStatus, 
        }}
    >
        {contextHolder}
        {children}
    </AuthContext.Provider>
    )
}