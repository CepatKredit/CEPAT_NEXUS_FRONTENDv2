
import React, { useState } from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, Spin, Form } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import StatusRemarks from './StatusRemarks';
import axios from 'axios';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';


function CharacterReference({ classname, BorrowerId, Creator, isEdit, User, data }) {
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [loading, setLoading] = useState(true);
    const [contactError, setContactError] = React.useState('')
    const [getInfo, setInfo] = React.useState({
        key: '',
        name: '',
        conNum: '',
        relShip: '',
        prov: '',
        remarks: '',
    })
    React.useEffect(() => { getCharacterRef.refetch() }, [BorrowerId])
    const [getStat, setStat] = React.useState(true)
    const role = GetData('ROLE') ? GetData('ROLE').toString() : null;
    const getCharacterRef = useQuery({
        queryKey: ['getCharacterRef'],
        queryFn: async () => {
            const result = await axios.get(`/getCharacterRef/${BorrowerId}`);
            let dataList = [{
                key: 0,
                no: '',
                name: '',
                conNum: '',
                relShip: '',
                prov: '',
                remarks: '',
            }]

            result.data.list?.map((x, i) => {
                dataList.push({
                    key: x.characterRefId,
                    no: i + 1,
                    name: x.fullName,
                    conNum: x.mobileNo,
                    relShip: x.relationship,
                    prov: x.province,
                    remarks: x.remarks
                })
            })
            setLoading(false);
            return dataList
        },
        refetchInterval: 5000,
        enabled: true,
        retryDelay: 1000,
    })

    const getRelationshipList = useQuery({
        queryKey: ['getRelationshipList'],
        queryFn: async () => {
            const result = await axios.get('/getRelationship');
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function GetReshipId() {
        if (!getRelationshipList) {
            return null;
        }
        const relshipvalue = form.getFieldValue('relShip');
        const ReshipHolder = getRelationshipList.data?.find((x) => x.description === relshipvalue || x.code === relshipvalue)
        return ReshipHolder ? ReshipHolder.code : null;
    }


    const provinceList = useQuery({
        queryKey: ['getProvinceSelect'],
        queryFn: async () => {
            const result = await axios.get('/getProvince');
           // console.log(result.data.list)
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function GetProvId() {
        if (!provinceList.data) {
            return null; // Or handle the case where the data is not available
        }
        const provincevalue = form.getFieldValue('prov');
        const ProvHolder = provinceList.data?.find((x) => x.provinceDescription === provincevalue || x.provinceCode === provincevalue);
        return ProvHolder ? ProvHolder.provinceCode : null;
    }


    const [getAddStat, setAddStat] = React.useState(false)

    async function onClickSave() {
        // Validate the form fields
        const row = await form.validateFields();
        setStat(false); // Update state before saving data
    
        // Prepare the data object
        const data = {
            BorrowersId: BorrowerId,
            FullName: row.name, // Adjusted field name to match your data structure
            Relationship: GetReshipId(), // Assuming GetReshipId() fetches the relationship ID
            MobileNo: row.conNum,
            Remarks: row.remarks || '',
            ProvinceId: row.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
            RecUser: Creator // Ensure Creator is properly defined
        };
    
        try {
            // Log the data for debugging
           // console.log("Data being sent to /addCharacterRef:", data);
    
            // Make the API call to save data
            const result = await axios.post('/addCharacterRef', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });
    
            // Check the result status
            if (result.data.status === 'success') {
                // Invalidate the query to refresh the data
                queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey(''); // Clear editing key
                setInfo({
                    name: '',
                    conNum: '',
                    relShip: '',
                    prov: '',
                    remarks: '',
                });
            }
        } catch (error) {
            // Handle any errors during the API call
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    }
    

    async function onClickEdit() {

        const row = await form.validateFields();
        getRelationshipList.refetch()
        provinceList.refetch()

        const data = {
            CharacterRefId: editingKey,
            FullName: row.name,
            Relationship: GetReshipId(),
            MobileNo: row.conNum,
            Remarks: row.remarks || '',
            ProvinceId: row.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
            ModUser: Creator
        };

        console.log("Data being sent to /addCharacterRef:", data);
        await axios.post('/editCharacterRef', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });

                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                    setEditingKey('');
                    setInfo({
                        key: '',
                        name: '',
                        conNum: '',
                        relShip: '',
                        prov: '',
                        remarks: '',
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

    async function onClickDelete(e) {
        try {
            const result = await axios.post(`/delete/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
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
    const [form] = Form.useForm();
    const columns = [
        {
            title: GetStatus === 'RELEASED' || GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' || GetStatus === 'FOR RE-APPLICATION' || GetStatus === 'FOR DOCUSIGN' || GetStatus === 'OK FOR DOCUSIGN'
                || GetStatus === 'TAGGED FOR RELEASE' || GetStatus === 'ON WAIVER' || GetStatus === 'CONFIRMATION' || GetStatus === 'CONFIRMED' || GetStatus === 'UNDECIDED' ||
                GetStatus === 'FOR DISBURSEMENT' || GetStatus === 'RELEASED' || GetStatus === 'RETURN TO LOANS PROCESSOR' || GetStatus === 'APPROVED (TRANS-OUT)' || GetStatus === 'RETURN TO CREDIT OFFICER' || GetStatus === 'RELEASED'
                ? (<></>)
                : (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Tooltip title='Add'>
                        <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || getAddStat}
                            icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                            onClick={() => {
                                const record = { key: 0, name: '', conNum: '', relShip: '', prov: '', remarks: '', }
                                edit(record)
                                setStat(false)
                                setEditingKey(0);
                                setAddStat(!getAddStat)
                                setInfo({
                                    ...getInfo,
                                    name: '',
                                    conNum: '',
                                    relShip: '',
                                    prov: '',
                                    remarks: '',
                                })
                            }} />
                    </Tooltip>
                </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '150px',
            editable: true,
        },
        {
            title: 'Contact Number',
            dataIndex: 'conNum',
            key: 'conNum',
            width: '100px',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relShip',
            key: 'relShip',
            width: '100px',
            editable: true,
        },
        {
            title: 'Province',
            dataIndex: 'prov',
            key: 'prov',
            width: '120px',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '120px',
            editable: true,
        },
        {
            hidden: GetStatus === 'RELEASED' || GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' || GetStatus === 'FOR RE-APPLICATION' || GetStatus === 'FOR DOCUSIGN' || GetStatus === 'OK FOR DOCUSIGN'
                || GetStatus === 'TAGGED FOR RELEASE' || GetStatus === 'ON WAIVER' || GetStatus === 'CONFIRMATION' || GetStatus === 'CONFIRMED' || GetStatus === 'UNDECIDED' ||
                GetStatus === 'FOR DISBURSEMENT' || GetStatus === 'RELEASED' || GetStatus === 'RETURN TO LOANS PROCESSOR'
                ? true : false,
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '60px',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save this record?"
                                    onConfirm={() => { onClickSave(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel this record?"
                                    onConfirm={() => {
                                        setStat(true)
                                        setAddStat(!getAddStat)
                                        setEditingKey('')
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"
                                >
                                    <Button icon={<CloseOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
                else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                            <Popconfirm
                                    title="Are you sure you want to save this record?"
                                    onConfirm={() => { onClickEdit(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {
                                        setStat(true)
                                        setAddStat(!getAddStat)
                                        setEditingKey('')
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"
                                >
                                    <Button icon={<CloseOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || editingKey !== ''} onClick={() => {

                                        edit(record)
                                        setAddStat(!getAddStat)

                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => {
                                        onClickDelete(record.key)
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"  >
                                    <Button disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />

                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
            }
        },
    ];



    const [editingKey, setEditingKey] = React.useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            name: record.name,
            conNum: record.conNum,
            relShip: record.relShip,
            prov: record.prov,
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


    async function onChangeProvince(value) {
        form.setFieldsValue({ 'prov': value });
    }
    
    async function onChangeRelationship(value) {
        form.setFieldsValue({ 'relShip': value });
    }
    
    async function onChangeContactNo(e, pointer) {
        if (pointer === 'contactNo') {
            let value = e;

            // Limit to 11 characters and ensure only numbers are input
            if (!/^\d*$/.test(value)) return; // Allow only digits
            value = value.slice(0, 11); // Limit to 11 digits

            form.setFieldsValue({ 'contactNo': value });
        }
    }

    async function onChangeToUpper(e, pointer) {
        if (pointer === 'name') {
            form.setFieldsValue({ 'name': toUpperText(e) });
        }
        else {
            form.setFieldsValue({ 'remarks': toUpperText(e) });
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
        const inputNode = dataIndex === 'prov'
            ? (
                <Select
                    className='w-[10rem]'
                    onChange={(value) => { onChangeProvince(value); }}
                    placeholder='Province'
                    options={provinceList.data?.map((x) => ({ value: x.provinceDescription, label: x.provinceDescription, }))}
                />
            )
            : dataIndex === 'relShip' ? (
                <Select
                    className='w-[10rem]'
                    onChange={(value) => { onChangeRelationship(value); }}
                    placeholder='Relationship'
                    options={getRelationshipList.data?.map(x => ({ value: x.code, label: x.description }))}
                />
            )
                : dataIndex === 'name' ? (
                    <>

                        <Input
                            className='w-[10rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'name'); }}
                            placeholder='Name' />

                    </>
                )
                    : dataIndex === 'conNum' ? (
                        <>
                            <Input
                                className='w-[10rem]'
                                onChange={(e) => onChangeContactNo(e.target.value, 'conNum')}
                                placeholder='Contact Number'
                                maxLength={11}
                            />
                        </>
                    )
                        : (
                            <>
                                <Input
                                    className='w-[10rem]'
                                    onChange={(e) => { onChangeToUpper(e.target.value, 'remarks'); }}
                                    placeholder='Remarks' />
                            </>
                        )

        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={
                    dataIndex === 'conNum'
                        ? [
                            { required: true, message: `Please input ${title}` },
                            { pattern: /^09\d{9}$/, message: 'Must start with "09" and be 11 digits' }
                        ]
                        : dataIndex === 'name' || dataIndex === 'relShip'
                            ? [{ required: true, message: `Please input ${title}` }]
                            : [] // No validation rules for 'prov' and 'remarks'
                }
                >
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = getCharacterRef.data?.filter(x => x.key !== 0);

    return (
        <div className={classname}>
            {User !== 'Credit' && User !== 'Lp' && (<StatusRemarks isEdit={!isEdit} User={User} data={data} />)}
            {contextHolder}
            <div className='mt-[9rem] w-full'>
                <div className='mt-[-4rem]'>
                    <center>
                        <SectionHeader title="List of Character Reference" />
                    </center>
                </div>
                <div className='mt-[2rem]'>
                    <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                        <Form form={form} component={false}>
                            <Table
                                columns={mergedColumns}
                                dataSource={
                                    loading
                                        ? []
                                        : (
                                            getStat === false
                                                ? getCharacterRef.data?.map((x) => ({
                                                    key: x.key,
                                                    no: x.no,
                                                    name: x.name,
                                                    conNum: x.conNum,
                                                    relShip: x.relShip,
                                                    prov: x.prov,
                                                    remarks: x.remarks
                                                }))
                                                : dataOnly?.map((x) => ({
                                                    key: x.key,
                                                    no: x.no,
                                                    name: x.name,
                                                    conNum: x.conNum,
                                                    relShip: x.relShip,
                                                    prov: x.prov,
                                                    remarks: x.remarks
                                                }))
                                        )
                                }
                                components={{ body: { cell: EditableCell } }}
                                rowClassName='editable-row'
                                pagination={false}
                                loading={{
                                    spinning: loading,
                                    indicator: <Spin tip="Loading..." />,
                                }}
                            />
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default CharacterReference;