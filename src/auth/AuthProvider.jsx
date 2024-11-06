import axios from 'axios'
import * as React from 'react'

const AuthContext = React.createContext(undefined)

export function useAuth() {
    const authContect = React.useContext(AuthContext)
    if (!authContect) {
        throw new Error('useAuth must be within a AuthProvider')
    }

    return authContect
}

function AuthProvider({ children }) {
    const [token, setToken] = React.useState()
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

    return children
}