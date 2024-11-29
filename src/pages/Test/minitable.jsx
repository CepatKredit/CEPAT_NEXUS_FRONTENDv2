import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { ColumnList } from '@utils/TableColumns';
import { Card, Space } from 'antd';

function minitable() {

    const AppDataListQuery = useQuery({
        queryKey: ['AppDataListQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/GET/G2AD/217fb1ac-310e-47a2-8780-e31db18c126f/150`);
                return result.list;
            } catch (error) {
                return [];
            }
        },
        enabled: true,
        refetchInterval: 60 * 1000,
        retryDelay: 1000,
        staleTime: 5 * 1000,
    });

    function capitalizeWords(string) {
        let container = string.toLowerCase()
        return container.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    }

    return (
        <div className='h-full flex flex-row justify-center item-center bg-stone-500'>
            <div className='m-3 overflow-y-auto w-[30rem]'>
                {
                    AppDataListQuery.data?.map((x, i) =>
                    (<div className='my-2'>
                        <Card title={(<div>Loan Application Number: <span className='text-cyan-600'>{x.loanAppCode}</span></div>)} hoverable>
                            <div className='w-[30rem]'><span className='font-bold'>Loan Product:</span>{` ${x.loanProduct}`}</div>
                            <div className='w-[30rem]'><span className='font-bold'>OFW:</span>{` ${x.borrowersFullName}`}</div>
                            <div className='w-[30rem]'><span className='font-bold'>Status:</span>{` ${capitalizeWords(x.statusName)}`}</div>
                            <div className='w-[30rem]'><span className='font-bold'>Latest Internal Remarks:</span>{` ${x.remarksIn}`}</div>
                        </Card>
                    </div>))
                }
            </div>
        </div>
    )
}

export default minitable