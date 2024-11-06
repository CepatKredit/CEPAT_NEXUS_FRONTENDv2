import * as React from 'react';
import SectionHeader from '@components/validation/SectionHeader';
import ResponsiveTable from '@components/validation/ResponsiveTable';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { ConfigProvider, Spin } from 'antd';

function Deduplication({ classname, data }) {
    const [getList, setList] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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

    React.useEffect(() => {
        if (!data.loanIdCode) getDuplicateLoan.refetch();
    }, [data]);

    const getDuplicateLoan = useQuery({
        queryKey: ['getDuplicateLoan'],
        queryFn: async () => {
            var result = await axios.get(`/getDuplicateLoans/${data?.ofwfname}/${data?.ofwlname}/${data?.loanIdCode}`)
            setList(result.data.list);
            setLoading(false);
            return result.data.list;
        },
        enabled: true,
        retryDelay: 1000,
    });
    return (
        <>
            <div className={classname}>
                <SectionHeader title="List of Previous Loan Application" />
                <div className='mt-2'>
                    <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                        <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center" size="large">
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
                        </Spin>
                    </ConfigProvider>
                </div>
            </div>
        </>
    );
}

export default Deduplication;
