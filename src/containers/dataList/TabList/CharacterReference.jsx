
import React, { useState } from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, Spin, Form } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import StatusRemarks from './StatusRemarks';
import axios from 'axios';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function CharacterReference({ classname, BorrowerId, Creator, isEdit, User, data }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext)
    const { getAppDetails } = React.useContext(LoanApplicationContext)
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
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

    React.useEffect(() => { getCharacterRef.refetch() }, [getAppDetails.loanIdCode]);

    const getCharacterRef = useQuery({
        queryKey: ['getCharacterRef', BorrowerId],
        queryFn: async () => {
            try {
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
                SET_LOADING_INTERNAL('CharRefTABLE', false);
                return dataList
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('CharRefTABLE', false);
            }
            return null;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    })

    React.useEffect(() => {
        if (!getAppDetails.loanIdCode) {
            SET_LOADING_INTERNAL('CharRefTABLE', true)
            getCharacterRef.refetch();
        }
    }, [getAppDetails]);

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


    const onClickSaveData = useMutation({
        mutationFn: async (row) => {
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
                const result = await axios.post('/addCharacterRef', data);
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        name: '',
                        conNum: '',
                        relShip: '',
                        prov: '',
                        remarks: '',
                    });
                }
            } catch (error) {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
            }
        }
    })

    async function onClickSave() {
        try {
            const row = await form.validateFields();
            setStat(false);
            onClickSaveData.mutate(row);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }


    const onClickEditData = useMutation({
        mutationFn: async (row) => {

            const data = {
                CharacterRefId: editingKey,
                FullName: row.name,
                Relationship: GetReshipId(),
                MobileNo: row.conNum,
                Remarks: row.remarks || '',
                ProvinceId: row.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
                ModUser: Creator
            };


            await axios.post('/editCharacterRef', data)
                .then((result) => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });

                    if (result.data.status === 'success') {
                        queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                        setStat(true);
                        setAddStat(false);
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
    })

    async function onClickEdit() {
        try {
            const row = await form.validateFields();
            onClickEditData.mutate(row);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }

   
    const onClickDeteleData = useMutation({
        mutationFn: async (e) => {
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
    })

    async function onClickDelete(e) {
        onClickDeteleData.mutate(e);
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
            width: '5%',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            editable: true,
        },
        {
            title: 'Contact Number',
            dataIndex: 'conNum',
            key: 'conNum',
            width: '15%',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relShip',
            key: 'relShip',
            width: '15%',
            editable: true,
        },
        {
            title: 'Province',
            dataIndex: 'prov',
            key: 'prov',
            width: '15%',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '20%',
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
            width: '10%',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickSave} loading={onClickSaveData.isPending} className='bg-[#2b972d]' />
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
                    )
                }
                else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickEdit} loading={onClickEditData.isPending} className='bg-[#2b972d]' />
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
                                    <Button disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger loading={onClickDeteleData.isPending} />

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
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                />
            )
            : dataIndex === 'relShip' ? (
                <Select
                    className='w-[10rem]'
                    onChange={(value) => { onChangeRelationship(value); }}
                    placeholder='Relationship'
                    options={getRelationshipList.data?.map(x => ({ value: x.code, label: x.description }))}
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                />
            )
                : dataIndex === 'name' ? (
                    <>

                        <Input
                            className='w-[12rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'name'); }}
                            placeholder='Name' />

                    </>
                )
                    : dataIndex === 'conNum' ? (
                        <>
                            <Input
                                className='w-[9rem]'
                                onChange={(e) => onChangeContactNo(e.target.value, 'conNum')}
                                placeholder='Contact Number'
                                maxLength={11}
                            />
                        </>
                    )
                        : (
                            <>
                                <Input
                                    className='w-[12rem]'
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
            <div className={`${(User === 'Credit' || User === 'Lp') ? 'mt-[5rem] ' : ''} w-full px-2`}>
            <div>
                    <center>
                        <SectionHeader title="List of Character Reference" />
                    </center>
                </div>
                <div className='mt-[0rem]'>
                    <Form form={form} component={false}>
                        <Table
                            columns={mergedColumns}
                            dataSource={
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
                            }
                            components={{ body: { cell: EditableCell } }}
                            rowClassName='editable-row'
                            pagination={false}
                            scroll={{ y: User === 'Credit' || User === 'Lp' ? 200 : 300 }}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default CharacterReference;