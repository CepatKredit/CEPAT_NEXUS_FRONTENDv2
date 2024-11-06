import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import PreLoad from '@containers/PreLoad.jsx'



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            cacheTime: Infinity
        },
        suspense: true
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider theme={{
        "token": {
            "fontSize": 14,
        },
        "components": {
            "Table": {
                "headerColor": "rgba(255, 255, 255, 0.88)",
                "headerBg": "rgb(52, 179, 49)",
                "headerSortActiveBg": "rgb(82, 196, 26)",
                "headerSortHoverBg": "rgb(63, 217, 59)",
                "fixedHeaderSortActiveBg": "rgb(82, 196, 26)",
                "headerBorderRadius": 20,
            }
        }
    }}>

        <QueryClientProvider client={queryClient}>
            <PreLoad>
                <App />
            </PreLoad>

        </QueryClientProvider>
    </ConfigProvider>
)
