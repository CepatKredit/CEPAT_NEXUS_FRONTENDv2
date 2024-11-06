import * as React from 'react'
import {
    Typography, Tooltip, Button, Input, Space,
    Form, Popconfirm, Table, notification, ConfigProvider, Tag
} from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { ListData } from '@utils/SampleData';
import { MdEditSquare } from "react-icons/md";
import { toEncrypt } from '@utils/Converter';

function DataTable() {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate()
    const [sortedInfo, setSortedInfo] = React.useState(ListData());
    const handleChange = (pagination, filters, sorter) => {
        const sortedDataSource = [...sortedInfo];
        if (sorter.columnKey === 'lan') {
            sortedInfo.sort((a, b) => a.lan > b.lan ? 1 : a.lan === b.lan ? 0 : -1)
        }
        if (sorter.columnKey === 'cName') {
            sortedInfo.sort((a, b) => a.cName > b.cName ? 1 : a.cName === b.cName ? 0 : -1)
        }
        setSortedInfo(sortedDataSource)

        const updatedSort = sorter.order === 'ascend' ? [...sortedInfo] : [...sortedInfo].reverse();
        setSortedInfo(updatedSort)
    };

    const column = [
        {
            title: 'Loan Application No.',
            dataIndex: 'lan',
            key: 'lan',
            width: '180px',
            fixed: 'left',
            align: 'center',
            sorter: (a, b, c) => { return c },
        },
        {
            title: 'Loan Product',
            dataIndex: 'loanProd',
            key: 'loanProd',
            width: '180px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Client Name',
            dataIndex: 'cName',
            key: 'cName',
            width: '200px',
            align: 'center',
            editable: true,
            sorter: (a, b, c) => { return c },
        },
        {
            title: 'OFW Departure Date',
            dataIndex: 'odd',
            key: 'odd',
            width: '180px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Loan Consultant',
            dataIndex: 'lc',
            key: 'lc',
            width: '150px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Renewal?',
            dataIndex: 'renew',
            key: 'renew',
            width: '100px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Loan Branch',
            dataIndex: 'lb',
            key: 'lb',
            width: '150px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Status',
            dataIndex: 'stat',
            key: 'stat',
            width: '150px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Screened By',
            dataIndex: 'sb',
            key: 'sb',
            align: 'center',
            width: '200px',
        },
        {
            title: 'Latest Remarks',
            dataIndex: 'lr',
            key: 'lr',
            align: 'center',
            width: '180px',
        },
        {
            title: 'Date Last Updated (Status / Remarks)',
            dataIndex: 'statrem',
            key: 'statrem',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Updated By',
            dataIndex: 'upby',
            key: 'upby',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Date Last Updated (Info and Uploading)',
            dataIndex: 'inup',
            key: 'inup',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Date of Application',
            dataIndex: 'doa',
            key: 'doa',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Date of Application',
            dataIndex: 'doa',
            key: 'doa',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: 'Operation',
            width: '100px',
            fixed: 'right',
            dataIndex: 'lan',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <center>
                        <Tooltip title='Edit'>
                            <Button disabled={editingKey !== ''} onClick={() => edit(record)} type='link'
                                icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                        </Tooltip>
                    </center>
                );
            },
        }
    ]

    const [form] = Form.useForm();
    const [data, setData] = React.useState(ListData());
    const [editingKey, setEditingKey] = React.useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            cName: '',
            odd: '',
            lc: '',
            renew: '',
            lb: '',
            stat: '',
            sb: '',
            lr: '',
            statrem: '',
            upby: '',
            inup: '',
            doa: '',
            ...record
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const mergedColumns = column.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {<Input />}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const [getSearch, setSearch] = React.useState('')

    return (
        <div className='mx-7 pt-[2%] h-[600px]'>
            {contextHolder}
            <div className='pb-2 pt-1'>
                <center>
                    <Space>
                        <Input size='large' allowClear className='w-[350px]' placeholder='Client Name' />
                        <Input size='large' allowClear className='w-[280px]' placeholder='Loan Product' />
                        <Input size='large' allowClear className='w-[250px]' placeholder='Loan Consultant' />
                        <Input size='large' allowClear className='w-[300px]' placeholder='Branch' />
                        <ConfigProvider theme={{ token: { colorPrimary: '#34b331' } }}>
                            <Button className=' bg-[#34b331]' size='large' type="primary" shape="circle" icon={<SearchOutlined />} />
                        </ConfigProvider>
                    </Space>
                </center>
            </div>
            <div className='h-[300px]'>
                <ConfigProvider theme={{
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
                    <Form form={form} component={false}>
                        <Table size='small' onChange={handleChange}
                            dataSource={sortedInfo.filter((items) => {
                                return getSearch.toUpperCase() === ''
                                    ? items
                                    : items.loanProd.includes(getSearch.toUpperCase(), /^/g) ||
                                    items.cName.includes(getSearch.toUpperCase(), /^/g)
                            }).map((x) => ({
                                key: x.key,
                                lan: (
                                    <Tooltip placement='left' title={<span>View Details</span>} arrow={true}>
                                        <Button type='link' size='small' color='#092b00' block
                                            onClick={() => {
                                                navigate(`/cepat/dashboard/for-screening-list/${x.lan}/tab=1`);
                                                localStorage.setItem('PTH', toEncrypt(`/dashboard/for-screening-list/${x.lan}`))
                                            }}>{x.lan}</Button>
                                    </Tooltip>
                                ),
                                loanProd: x.loanProd,
                                cName: x.cName,
                                odd: x.odd,
                                lc: x.lc,
                                renew: (<Tag color={x.renew === 'NEW' ? '#faff03' : '#483d8b'}>
                                    <span className={
                                        x.renew === 'NEW' ? 'text-stone-950 font-bold' : 'font-bold'
                                    }>
                                        {x.renew}
                                    </span>
                                </Tag>),
                                lb: x.lb,
                                stat: x.stat,
                                sb: x.sb,
                                lr: x.lr,
                                statrem: x.statrem,
                                upby: x.upby,
                                inup: x.inup,
                                doa: x.doa,
                            }))}
                            columns={mergedColumns}
                            pagination={{
                                pageSize: 50,
                            }}
                            scroll={{
                                y: 520,
                                x: '100%'
                            }}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered />
                    </Form>
                </ConfigProvider>
            </div>
        </div>
    )
}

export default DataTable