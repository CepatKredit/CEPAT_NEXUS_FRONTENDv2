import * as React from 'react'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from "@api/base-api/BaseApi";
const DataContext = React.createContext()
function PreLoad({ children }) {

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

    //REFETCH FOR PRELOAD DATA
    React.useEffect(() => {
        getBankList.refetch()
        getPurposeList.refetch()
        TileCountListQuery.refetch()
    }, [])

    function SET_PATH_LOCATION(SELECTED_STATUS) {
        if (SELECTED_STATUS === 'DECLINED') { localStorage.setItem('SP', '/ckfi/declined'); }
        else if (SELECTED_STATUS === 'CANCELLED') { localStorage.setItem('SP', '/ckfi/cancelled'); }

        else if (SELECTED_STATUS === 'LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/lack-of-documents'); }
        else if (SELECTED_STATUS === 'FOR CREDIT ASSESSEMENT') { localStorage.setItem('SP', '/ckfi/credit-assessment-list'); }
        else if (SELECTED_STATUS === 'FOR INITIAL INTERVIEW') { localStorage.setItem('SP', '/ckfi/initial-interview'); }
        else if (SELECTED_STATUS === 'FOR WALK-IN') { localStorage.setItem('SP', '/ckfi/walk-in'); }
        else if (SELECTED_STATUS === 'COMPLIED - LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/complied/lack-of-documents'); }
        else if (SELECTED_STATUS === 'RECEIVED') { localStorage.setItem('SP', '/ckfi/received'); }
        else if (SELECTED_STATUS === 'REASSESSED TO CREDIT ASSOCIATE') { localStorage.setItem('SP', '/ckfi/return/credit-associate'); }
        else if (SELECTED_STATUS === 'RETURN TO CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/return/credit-officer'); }
        else if (SELECTED_STATUS === 'ON WAIVER') { localStorage.setItem('SP', '/ckfi/on-waiver'); }

        else if (SELECTED_STATUS === 'SCREENING') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
        else if (SELECTED_STATUS === 'INTERVIEW') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
        else if (SELECTED_STATUS === 'FOR CALLBACK') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
        else if (SELECTED_STATUS === 'FOR VERIFICATION') { localStorage.setItem('SP', '/ckfi/for-verification'); }
        else if (SELECTED_STATUS === 'PRE-CHECK') { localStorage.setItem('SP', '/ckfi/pre-check'); }
        else if (SELECTED_STATUS === 'FOR APPROVAL') { localStorage.setItem('SP', '/ckfi/for-approval'); }
        else if (SELECTED_STATUS === 'REASSESSED TO MARKETING') { localStorage.setItem('SP', '/ckfi/reassessed/marketing'); }
        else if (SELECTED_STATUS === 'PRE-APPROVAL') { localStorage.setItem('SP', '/ckfi/reassessed/credit-officer'); }
        else if (SELECTED_STATUS === 'APPROVED (TRANS-OUT)') { localStorage.setItem('SP', '/ckfi/trans-in'); }

        else if (SELECTED_STATUS === 'RETURN TO LOAN PROCESSOR') { localStorage.setItem('SP', '/ckfi/return/loan-processor'); }
        else if (SELECTED_STATUS === 'FOR DOCUSIGN') { localStorage.setItem('SP', '/ckfi/for-docusign'); }
        else if (SELECTED_STATUS === 'OK FOR DOCUSIGN') { localStorage.setItem('SP', '/ckfi/ok/for-docusign'); }
        else if (SELECTED_STATUS === 'TAGGED FOR RELEASE') { localStorage.setItem('SP', '/ckfi/tagged-for-release'); }
        else if (SELECTED_STATUS === 'FOR DISBURSMENT') { localStorage.setItem('SP', '/ckfi/for-disbursement'); }

        else if (SELECTED_STATUS === 'RELEASED') { localStorage.setItem('SP', '/ckfi/released'); }
        else if (SELECTED_STATUS === 'CONFIRMATION') { localStorage.setItem('SP', '/ckfi/confirmation'); }
        else if (SELECTED_STATUS === 'CONFIRMED') { localStorage.setItem('SP', '/ckfi/confirmed'); }
        else { localStorage.setItem('SP', '/ckfi/undecided'); }
    }

    return (
        <DataContext.Provider value={{
            getBank,
            getPurpose,
            GET_LOAN_APPLICATION_NUMBER,
            SET_LOAN_APPLICATION_NUMBER,
            GET_TOTAL_AMOUNT,
            SET_REFRESH_LAN,
            SET_PATH_LOCATION,
            GET_DATA_COUNTER
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default PreLoad

export const useDataContainer = () => React.useContext(DataContext)