import * as React from 'react';
import SectionHeader from '@components/validation/SectionHeader';
import ResponsiveTable from '@components/validation/ResponsiveTable';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function Deduplication({ classname, data }) {
    const [getList, setList] = React.useState([]);
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext)
    const columns = [
        {
            title: '#',
            dataIndex: 'num',
            key: 'num',
        },
        {
            title: 'Loan Application No.',
            dataIndex: 'loanAppCode',
            key: 'loanAppCode',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'OFW Name',
            dataIndex: 'borrowersFullName',
            key: 'borrowersFullName',
        },
        {
            title: 'OFW B-Day',
            dataIndex: 'birthDate',
            key: 'birthDate',
        },
        {
            title: 'Date of Application',
            dataIndex: 'recDate',
            key: 'recDate',
        },
        {
            title: 'Assigned Branch',
            dataIndex: 'branch',
            key: 'branch',
        },
    ];

    const getDuplicateLoan = useQuery({
        queryKey: ['getDuplicateLoan'],
        queryFn: async () => {
            try {
                var result = await axios.get(`/GET/G4DL/${data?.ofwfname}/${data?.ofwlname}/${data?.loanIdCode}`)
                setList(result.data.list);
                SET_LOADING_INTERNAL('Deduplication', false)
                return result.data.list;
            } catch (error) {
                console.error('Error fetching duplicate loans:', error);
                SET_LOADING_INTERNAL('Deduplication', false);
                return [];
            }
        },
        enabled: true,
        retryDelay: 1000,
    });

    React.useEffect(() => {
        if (data.loanIdCode !== '') {
            SET_LOADING_INTERNAL('Deduplication', true)
            getDuplicateLoan.refetch();
        }
    }, [data]);

    return (
        <>
            <div className={classname}>
                <SectionHeader title="List of Previous Loan Application" />
                <div className='mt-2'>
                    <ResponsiveTable
                        columns={columns}
                        height={600}
                        width={400}
                        rows={getList && getList.length > 0
                            ? getList.map((x, i) => ({
                                key: i,
                                num: i + 1,
                                loanAppCode: x.loanAppCode,
                                status: x.status,
                                borrowersFullName: x.borrowersFullName,
                                birthDate: mmddyy(x.birthDate),
                                recDate: mmddyy(x.recDate),
                                branch: x.branch,
                            }))
                            : []}
                    />
                </div>
            </div>
        </>
    );
}

export default Deduplication;
