import * as React from 'react'
import { Select, Space, Input, Divider, Button, Tooltip, Popconfirm, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { toUpperText } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function SelectExpense({ data, event, excludeItems }) {

    const [api, contextHolder] = notification.useNotification();
    const NDIExpenseListQuery = useQuery({
        queryKey: ['NDIExpenseList'],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G24N/${parseInt(24)}`)
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })

    const [newValue, setValue] = React.useState('')
    const token = localStorage.getItem('UTK');
    const onClickAdd = useMutation({
        mutationFn: async () => {
            await axios.post(`/POST/P74ANS/${parseInt(22)}/${newValue}/${jwtDecode(token).USRID}`)
                .then((result) => {
                    setValue('')
                    NDIExpenseListQuery.refetch()
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                })
                .catch((error) => {
                    console.log(error)
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })
    const selectRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const [scrollCount, setScrollCount] = React.useState(0);
    const scrollTimeout = React.useRef(null);

    const handleScroll = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setScrollCount((prevCount) => {
                if (prevCount + 1 >= 5) {
                    if (selectRef.current) {
                        selectRef.current.blur();
                    }
                    return 0;
                }
                return prevCount + 1;
            });
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setScrollCount(0);
            }, 250);
        }
    };

    React.useEffect(() => {
        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('scroll', handleScroll, true);
            clearTimeout(scrollTimeout.current);
        };
    }, []);
    const excludedIds = new Set(excludeItems?.map(item => item.id));
    const filteredOptions = NDIExpenseListQuery.data?.filter(item => !excludedIds.has(item.id))
        .map(item => ({
            key: item.id,
            value: item.id,
            label: item.name,
        })) || [];

    return (
        <div className='w-[12rem]'>
            {contextHolder}
            <Select
                ref={selectRef}
                onChange={(value, option) => {
                    const lab = option?.label || '';
                    const val = option?.value || '';
                    event(lab, val)
                }}
                value={data || undefined}
                allowClear
                showSearch
                placeholder='Select Other Expense'
                style={{ width: '100%' }}
                dropdownRender={(menu) => (
                    <div ref={dropdownRef}>
                        {menu}
                        <Divider style={{ margin: '8px 0', }} />
                        <Space>
                            <Input size='small'
                                placeholder='Other Expense'
                                value={newValue}
                                onChange={(e) => {
                                    setValue(toUpperText(e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    e.stopPropagation()
                                }}
                            />
                            <Tooltip placement='bottom' title={'Add Expense'}>
                                <Popconfirm
                                    title='Add Record'
                                    description='Are you sure to add this record?'
                                    onConfirm={() => { onClickAdd.mutate() }}
                                    onCancel={() => { setValue('') }}
                                    okText='Yes'
                                    cancelText='No'>
                                    <Button type="primary" size='small' icon={<PlusOutlined />}
                                        loading={onClickAdd.isLoading}
                                        disabled={!newValue ? true : false}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    </div>
                )}
                labelRender={() => { { data } }}
                options={filteredOptions}
            />
        </div>
    )
}

export default SelectExpense