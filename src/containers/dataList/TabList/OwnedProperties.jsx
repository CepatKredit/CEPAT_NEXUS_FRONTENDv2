import React, { useEffect } from 'react';
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
import { DropdownOwnedProperties } from '@utils/FixedData';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function OwnedProperties({ data, User }) {
    const { SET_LOADING_INTERNAL, getAppDetails } = React.useContext(LoanApplicationContext);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Properties: '',
        Location: '',
        Remarks: '',

    });
    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();

    const getOwnedProperties = useQuery({
        queryKey: ['getOwnedProperties'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            try {
                const result = await axios.get(`/GET/G111OP/${toDecrypt(localStorage.getItem('SIDC'))}`);
                let dataList = [{
                    key: 0,
                    no: '',
                    Properties: '',
                    Location: '',
                    Remarks: '',
                }];

                result.data.list?.map((x, i) => {
                    dataList.push({
                        key: x.id,
                        no: i + 1,
                        Properties: x.properties,
                        Location: x.location,
                        Remarks: x.remarks,
                    });
                });
                SET_LOADING_INTERNAL('PropertiesTABLE', false);
                return dataList;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('PropertiesTABLE', false);
            }
            return null;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });


    React.useEffect(() => {
        SET_LOADING_INTERNAL('PropertiesTABLE', true)
        getOwnedProperties.refetch();
    }, [getAppDetails]);


    function GetPropertiesOption() {
        const Properties = form.getFieldValue('properties');
        const PropertiesOptionHolder = DropdownOwnedProperties().find(
            (x) => x.label === Properties || x.value === Properties
        );
        return PropertiesOptionHolder ? PropertiesOptionHolder.value : null;
    }

    const [getAddStat, setAddStat] = React.useState(false)


    async function onClickSave() {

        setStat(false);
        const row = await form.validateFields();
        const data = {
            LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
            Properties: row.properties,
            Location: row.location,
            Remarks: row.remarks || '',
            RecUser: jwtDecode(token).USRID
        }
        console.log(data)
        await axios.post('/POST/P136AOP', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    form.resetFields();
                    setInfo({
                        Properties: '',
                        Location: '',
                        Remarks: '',
                    });
                }
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
            })
    }

    async function onClickEdit() {

        try {
            const row = await form.validateFields();
            const data = {
                Id: editingKey,
                Properties: GetPropertiesOption(),
                Location: row.location,
                Remarks: row.remarks || '',
                ModUser: jwtDecode(token).USRID
            };

            console.log('Data to be sent to the server:', data);
            const result = await axios.post('/POST/P137UOP', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    Properties: '',
                    Location: '',
                    Remarks: '',
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
            const result = await axios.post(`/POST/P138DOP/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
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
    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
            if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled'
                || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/for-re-application' || LOCATION === '/ckfi/assessement/credit') {
                console.log('MA')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '20') {
            {
                if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/for-approval'
                    || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/for-re-application'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('LC')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            {
                if (LOCATION === '/ckfi/for-approval' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('CRA')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/under-lp'
                || LOCATION === '/ckfi/special-lane' || LOCATION === '/ckfi/assessement/credit' || LOCATION === '/ckfi/queue-bucket'
                || LOCATION === '/ckfi/for-verification' || LOCATION === '/ckfi/pre-check' || LOCATION === '/ckfi/returned/marketing'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/reassessed/credit-officer' || LOCATION === '/ckfi/for-approval'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                console.log('CRO')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            console.log('LPO')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }
    const [getStatus, setStatus] = React.useState(false)
    React.useEffect(() => { setStatus(DISABLE_STATUS(localStorage.getItem('SP'))); }, [localStorage.getItem('SIDC')])
    const [form] = Form.useForm();
    const columns = [
        {
            title: (<div className="flex items-center">
                {!DISABLE_STATUS(localStorage.getItem('SP')) && (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Tooltip title='Add'>
                            <Button className='bg-[#3b0764]' type='primary'
                                icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                                onClick={() => {
                                    const record = { key: 0, properties: '', location: '', remarks: '' }
                                    edit(record)
                                    setStat(false)
                                    setEditingKey(0);
                                    setAddStat(!getAddStat)
                                    setInfo({
                                        ...getInfo,
                                        Properties: '',
                                        Location: '',
                                        Remarks: '',
                                    })
                                }} />

                        </Tooltip>
                    </ConfigProvider>
                )}
            </div>
            ),
            dataIndex: 'no',
            key: 'no',
            width: '6%',
            align: 'center',
        },
        {
            title: 'Properties',
            dataIndex: 'properties',
            key: 'properties',
            width: '25%',
            editable: true,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: '25%',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '25%',
            editable: true,
        },
        {
            hidden: DISABLE_STATUS(localStorage.getItem('SP')),
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (User === 'Lp') {
                    return null;
                }
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8', colorPrimaryHover: '#34b330' } }}>
                                    <Button icon={<SaveOutlined />} type='primary' onClick={onClickSave} className='bg-[#2b972d]' />
                                </ConfigProvider>
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
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8', colorPrimaryHover: '#34b330' } }}>
                                    <Button icon={<SaveOutlined />} type='primary' onClick={onClickEdit} className='bg-[#2b972d]' />
                                </ConfigProvider>
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
                                    <Button className='bg-[#3b0764]' disabled={editingKey !== ''} onClick={() => {

                                        edit(record);
                                        setAddStat(!getAddStat);
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => { onClickDelete(record.key); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
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
            properties: record.properties,
            location: record.location,
            remarks: record.remarks,
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

    async function onChangeProperties(e, pointer) {
        if (pointer === 'properties') { form.setFieldsValue({ 'properties': e }); }
    }

    async function onChangeToUpper(e, pointer) {
        if (pointer === 'location') { form.setFieldsValue({ 'location': toUpperText(e) }) }
        else { form.setFieldsValue({ 'remarks': toUpperText(e) }) }
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
        const inputNode = dataIndex === 'properties'
            ? (
                <>
                    <Select
                        className='w-[13rem]'
                        onChange={(value) => { onChangeProperties(value); }}
                        placeholder='Properties'
                        options={DropdownOwnedProperties().map(x => ({
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
            : dataIndex === 'location'
                ? (
                    <>
                        <Input
                            className='w-[17rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'location'); }}
                            placeholder='Location' />
                    </>
                )
                : dataIndex === 'remarks'
                    ? (
                        <>
                            <Input
                                className='w-[17rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'remarks'); }}
                                placeholder='Remarks' />
                        </>
                    ) : null
        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={dataIndex === 'remarks' ? [] : [
                    {
                        required: true,
                        message: `Please Input ${title}`,
                    },
                ]}
                >
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = Array.isArray(getOwnedProperties.data)
        ? getOwnedProperties.data.filter(x => x.key !== 0)
        : [];

    return (
        <div className='flex flex-col items-center'>
            {contextHolder}
            <div className='w-full px-2'>
                <div>
                    <center>
                        <SectionHeader title="Owned Properties of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-[0rem]'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns.map((col) => ({
                                ...col,
                                width: col.width || '25%',
                            }))}
                            dataSource={
                                getStat === false
                                    ? getOwnedProperties.data?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        properties: DropdownOwnedProperties().find((option) => option.value === x.Properties)?.label || x.Properties,
                                        location: x.Location,
                                        remarks: x.Remarks,
                                    }))
                                    : dataOnly?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        properties: DropdownOwnedProperties().find((option) => option.value === x.Properties)?.label || x.Properties,
                                        location: x.Location,
                                        remarks: x.Remarks,
                                    }))
                            }
                            components={{ body: { cell: EditableCell } }}
                            rowClassName='editable-row'
                            pagination={false}
                            scroll={{ y: 200 }}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default OwnedProperties;
