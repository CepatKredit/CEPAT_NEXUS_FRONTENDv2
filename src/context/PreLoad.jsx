import * as React from 'react'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from "@api/base-api/BaseApi";
import { LoanProductList } from '@components/ComponentDataHooks';
const DataContext = React.createContext()
function PreLoad({ children }) {
    //From components
    const GET_LOAN_PRODUCT_LIST = LoanProductList();

    const [getPurpose, setPurpose] = React.useState([])
    const getPurposeList = useQuery({
        queryKey: ['PurposeListQuery'],
        queryFn: async () => {
            const result = await GET_LIST(`/getPurposeList`)
            let dataContainer = []
            result.list?.map((x) => { dataContainer.push(x) })
            setPurpose(dataContainer)
            return dataContainer
        },
        enabled: true
    })

    const [getBank, setBank] = React.useState([])
    const getBankList = useQuery({
        queryKey: ['BankListQuery'],
        queryFn: async () => {
            const result = await GET_LIST(`/getPaymentType`)
            let dataContainer = []
            result.list?.map((x) => { dataContainer.push(x) })
            setBank(dataContainer)
            return dataContainer
        },
        enabled: true
    })

    const [GET_LOAN_APPLICATION_NUMBER, setLAN] = React.useState('')
    function SET_LOAN_APPLICATION_NUMBER(value) { setLAN(value) }

    const [GET_TOTAL_AMOUNT, setAmount] = React.useState('')
    const getDisbursementList = useQuery({
        queryKey: ['PRELOAD_DISBURSEMENT', GET_LOAN_APPLICATION_NUMBER],
        queryFn: async () => {
            let total = 0
            const result = await GET_LIST(`/getDisbursementList/${GET_LOAN_APPLICATION_NUMBER}/${'NP'}`)
            result.list?.map((x) => { total += parseFloat(x.amount) })
            setAmount(total.toString())
            return result.list
        },
        enabled: true
    })

    const [GET_REFRESH_LAN, setRefreshLan] = React.useState(0)
    function SET_REFRESH_LAN(value) { setRefreshLan(value) }

    React.useEffect(() => { getDisbursementList.refetch(); SET_REFRESH_LAN(0); }, [GET_REFRESH_LAN])

    const [GET_DATA_COUNTER, setDataCounter] = React.useState([])
    const [getRefreshTileCounter, setRefreshTileCounter] = React.useState(0)
    const TileCountListQuery = useQuery({
        queryKey: ['TileCountListQuery'],
        queryFn: async () => {
            const result = await GET_LIST(`/tileCount`);
            setDataCounter(result.list)
            return result.list;
        },
        enabled: true,
        refetchInterval: 60 * 1000,
        retryDelay: 1000,
        staleTime: 5 * 1000
    });
    function SET_REFRESH_TILE_COUNTER(value) { setRefreshTileCounter(value) }

    React.useEffect(() => { TileCountListQuery.refetch(); SET_REFRESH_TILE_COUNTER(0) }, [getRefreshTileCounter])

    //REFETCH FOR PRELOAD DATA
    React.useEffect(() => {
        getBankList.refetch()
        getPurposeList.refetch()
        TileCountListQuery.refetch()
    }, [])

    return (
        <DataContext.Provider value={{
            //Components
            GET_LOAN_PRODUCT_LIST,
            //Accounting
            getBank,
            getPurpose,
            GET_LOAN_APPLICATION_NUMBER,
            SET_LOAN_APPLICATION_NUMBER,
            GET_TOTAL_AMOUNT,
            SET_REFRESH_LAN,
            GET_DATA_COUNTER,
            SET_REFRESH_TILE_COUNTER
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default PreLoad

export const useDataContainer = () => React.useContext(DataContext)