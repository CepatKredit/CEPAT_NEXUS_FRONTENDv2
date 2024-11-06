import * as React from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const Api = axios.create({
    baseURL: import.meta.env.VITE_URL,
    withCredentials: true
})

Api.interceptors.request.use(async (config) => {
    config.headers.Authorization =
        !config._retry && token
            ? `Bearer ${localStorage.getItem('UTK')}`
            : config.headers.Authorization
    return config;
});

export default Api;
