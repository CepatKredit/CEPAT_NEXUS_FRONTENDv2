import React, { useEffect, useRef } from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin, Form } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import moment from 'moment';
import axios from 'axios';
import { toDecrypt } from '@utils/Converter';
import { DropdownOwnedAssets } from '@utils/FixedData';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function OwnedAsset({ data, User }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const saveButtonRef = useRef(null);
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Category: '',
        Make: '',
        YearModel: '',
        PlateNo: '',

    });

    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();

    const getOwnedAssets = useQuery({
        queryKey: ['getOwnedAssets'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            const result = await axios.get(`/getOwnedAssets/${toDecrypt(localStorage.getItem('SIDC'))}`);
            let dataList = [{
                key: 0,
                no: '',
                Category: '',
                Make: '',
                YearModel: '',
                PlateNo: '',
            }];

            result.data.list?.map((x, i) => {
                dataList.push({
                    key: x.id,
                    no: i + 1,
                    Category: x.category,
                    Make: x.make,
                    YearModel: x.yearModel,
                    PlateNo: x.plateNo,
                });
            });
            SET_LOADING_INTERNAL('AssetTABLE', false)
            return dataList;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });

    React.useEffect(() => {
        if (!data.loanIdCode) {
            SET_LOADING_INTERNAL('AssetTABLE', true)
            getOwnedAssets.refetch();
        }
    }, [data]);

    function GetAssetsOption() {
        const categoryValue = form.getFieldValue('category');
        const CategoryOptionHolder = DropdownOwnedAssets().find(
            (x) => x.label === categoryValue || x.value === categoryValue
        );
        return CategoryOptionHolder ? CategoryOptionHolder.value : null;
    }

    const [getAddStat, setAddStat] = React.useState(false)

    async function onClickSave() {

        setStat(false);

        const row = await form.validateFields();
        const data = {
            LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
            Category: GetAssetsOption(),
            Make: row.make,
            YearModel: row.yearModel,
            PlateNo: row.plateNo,
            RecUser: jwtDecode(token).USRID
        }
        await axios.post('/addOwnAsset', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        Category: '',
                        Make: '',
                        YearModel: '',
                        PlateNo: '',
                    });
                }
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
            })
        saveButtonRef.current?.focus();
    }

    async function onClickEdit() {
        try {
            const row = await form.validateFields();
            const data = {
                Id: editingKey,
                Category: GetAssetsOption(),
                Make: row.make,
                YearModel: row.yearModel,
                PlateNo: row.plateNo,
                ModUser: jwtDecode(token).USRID
            };
            console.log('Data to be sent to the server:', data);
            const result = await axios.post('/editOwnedAssets', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    Category: '',
                    Make: '',
                    YearModel: '',
                    PlateNo: '',
                });
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    }

    async function onClickDelete(e) {
        try {
            const result = await axios.post(`/DeleteOwnedAssets/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
        }
    }
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'RELEASED'
    ];
    const [form] = Form.useForm();
    const columns = [
        {

            title: (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            const record = { key: 0, category: '', make: '', yearModel: '', plateNo: '' }
                            edit(record)
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                Category: '',
                                Make: '',
                                YearModel: '',
                                PlateNo: '',
                            })
                        }} />

                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '5%',
            align: 'center'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '20%',
            editable: true,
        },
        {
            title: 'Make',
            dataIndex: 'make',
            key: 'make',
            width: '20%',
            editable: true,
        },
        {
            title: 'Year Model',
            dataIndex: 'yearModel',
            key: 'yearModel',
            width: '20%',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'plateNo',
            key: 'plateNo',
            width: '30%',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickSave} />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    );
                } else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickEdit} />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>

                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {
                                        edit(record);
                                        setAddStat(!getAddStat);
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => {
                                        onClickDelete(record.key);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                }
            },
        },
    ];
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            category: record.category,
            make: record.make,
            yearModel: record.yearModel,
            plateNo: record.plateNo,
        })
        setEditingKey(record.key);
    };

    const mergedColumns = columns.map((col) => {
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
    async function onChangeCategory(e, pointer) {
        if (pointer === 'category') { form.setFieldsValue({ 'category': e }); }
    }

    async function onChangeToUpper(e, pointer) {

        if (pointer === 'make') {
            form.setFieldsValue({ 'make': e });
        } else if (pointer === 'yearModel') {
            form.setFieldsValue({ 'yearModel': e });
        } else {
            form.setFieldsValue({ 'plateNo': e });
        }
    }


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
        const inputNode = dataIndex === 'category'
            ? (
                <>
                    <Select
                        className='w-[13rem]'
                        onChange={(value) => { onChangeCategory(value); }}
                        placeholder='Category'
                        options={DropdownOwnedAssets().map(x => ({
                            value: x.value,
                            label: x.label
                        }))}
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </>
            )
            : dataIndex === 'make'
                ? (
                    <>

                        <Input
                            className='w-[13rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'make'); }}
                            placeholder='Make' />
                    </>
                )
                : dataIndex === 'yearModel'
                    ? (
                        <>

                            <Input
                                className='w-[13rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'yearModel'); }}
                                placeholder='Year Model' />
                        </>
                    )
                    : dataIndex === 'plateNo'
                        ? (
                            <>

                                <Input
                                    className='w-[13rem]'
                                    onChange={(e) => { onChangeToUpper(e.target.value, 'plateNo'); }}
                                    placeholder='Remarks' />

                            </>
                        ) : null
        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={
                    dataIndex !== 'plateNo' ? [{ required: true, message: `Please Input ${title}` }] : []
                }>
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = Array.isArray(getOwnedAssets.data)
        ? getOwnedAssets.data.filter(x => x.key !== 0)
        : [];

    return (
        <div className='h-[500px] flex flex-col items-center'>
            {contextHolder}
            <div className='mt-[5rem] w-[100%] px-2'>
                <div className='mt-[-4rem]'>
                    <center>
                        <SectionHeader title="Owned Assets of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-[0rem]'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns}
                            dataSource={
                                getStat === false
                                    ? getOwnedAssets.data?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        category: DropdownOwnedAssets().find((option) => option.value === x.Category)?.label || x.Category,
                                        make: x.Make,
                                        yearModel: x.YearModel,
                                        plateNo: x.PlateNo,
                                    }))
                                    : dataOnly?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        category: DropdownOwnedAssets().find((option) => option.value === x.Category)?.label || x.Category,
                                        make: x.Make,
                                        yearModel: x.YearModel,
                                        plateNo: x.PlateNo,
                                    }))
                            }
                            components={{ body: { cell: EditableCell } }}
                            rowClassName='editable-row'
                            pagination={false}
                            scroll={{ y: 300 }}
                        />
                    </Form>
                </div>
            </div>
        </div>

    );
}

export default OwnedAsset;
