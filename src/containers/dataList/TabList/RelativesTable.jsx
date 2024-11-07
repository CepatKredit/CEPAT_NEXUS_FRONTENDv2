import React from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, Spin, Form } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { WorkEducStatusOption } from '@utils/FixedData';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import axios from 'axios';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import dayjs from 'dayjs';
import { GetData } from '@utils/UserData';
import { getDependentsCount } from '@hooks/DependentsController';
import { toUpperText } from '@utils/Converter';


function Relatives({ BorrowerId, onUpdateCount, User }) {
    const suffixRef = React.useRef();
    const { setCount } = getDependentsCount();
    const saveButtonRef = React.useRef();
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [getInfo, setInfo] = React.useState({
        RelativeID: '',
        key: '',
        FullName: '',
        Suffix: '',
        ContactNo: '',
        Birthdate: '',
        WorkEducStatus: '',
        Relationship: '',
    });

    const [getStat, setStat] = React.useState(true);
    React.useEffect(() => {
        getRelatives.refetch()
       // getRelativeSuffix.refetch()
    }, [BorrowerId]);

    const getRelatives = useQuery({
        queryKey: ['getRelatives'],
        queryFn: async () => {
            const result = await axios.get(`/getRelatives/${BorrowerId}`);
            //  console.log("API Result:", result);

            let dataList = [{
                key: 0,
                no: '',
                FullName: '',
                Suffix: '',
                ContactNo: '',
                Birthdate: '',
                WorkEducStatus: '',
                Relationship: '',
            }];

            result.data.list?.map((x, i) => {


                dataList.push({
                    key: x.code,
                    no: i + 1,
                    FullName: x.fullName,
                    Suffix: x.suffix,
                    ContactNo: x.contactNo,
                    Birthdate: x.birthdate,
                    WorkEducStatus: x.workEducStatus,
                    Relationship: x.relationship,
                });
            });

            const updatedCount = dataList.length;
            setCount(updatedCount);
            onUpdateCount(updatedCount);
            setLoading(false);
            return dataList;
        },
        refetchInterval: (data) => {
            data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });

    /*if (getRelatives.data) {
        console.log("Row count:", getRelatives.data.length - 1);
    }*/


    const [getReshipList, setReshipList] = React.useState()
    const getRelationshipList = useQuery({
        queryKey: ['getRelationshipList'],
        queryFn: async () => {
            const result = await axios.get('/getRelativesRelationship');
            setReshipList(result.data.list)
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    /*function GetReshipId() {
        if (!getRelationshipList.data) {
            return null; // or handle appropriately
        }
        const ReshipHolder = getRelationshipList.data.find(
            (x) => x.description === getInfo.Relationship || x.code === getInfo.Relationship
        );
        return ReshipHolder ? ReshipHolder.code : null; // Safely return the code or null
    }*/

    function GetReshipId() {
        if (!getRelationshipList.data) {
            return null; // or handle appropriately
        }
        const relationshipvalue = form.getFieldValue('relationship');
        const ReshipHolder = getRelationshipList.data.find(
            (x) => x.description === relationshipvalue || x.code === relationshipvalue
        );
        return ReshipHolder ? ReshipHolder.code : null;
    }

    /* const [getSuffixList, setSuffixList] = React.useState()
     const getRelativeSuffix = useQuery({
         queryKey: ['getRelativeSuffix'],
         queryFn: async () => {
             const result = await axios.get('/getRelativesSuffix');
             setSuffixList(result.data.list)
 
             return result.data.list;
         },
         refetchInterval: (data) => {
             data?.length === 0
                 ? 500 : false
         },
         enabled: true,
         retryDelay: 1000,
     });
 
     
 
     function GetSuffixId() {
         if (!getSuffixList) {
             return null; // or handle appropriately
         }
         const suffixValue = form.getFieldValue('suffix');
         const SuffixHolder = getSuffixList.find(
             (x) => x.description === suffixValue || x.code === suffixValue
         );
         return SuffixHolder ? SuffixHolder.code : null; // Return the correct code
     }*/




    function GetWorkEducStatusId() {
        const workValue = form.getFieldValue('workEducStatus');
        const workEducStatusHolder = WorkEducStatusOption().find(
            (x) => x.label === workValue || x.value === workValue
        );
        return workEducStatusHolder ? workEducStatusHolder.value : null;
    }


    const [getAddStat, setAddStat] = React.useState(false)

    async function onClickSave() {

        const row = await form.validateFields();
        setStat(false);


        const data = {
            BorrowersId: BorrowerId,
            Fullname: row.fullName,
            Suffix: row.suffix,
            Contactno: row.contactNo,
            Birthdate: row.birthdate,
            workEducStatus: row.workEducStatus,
            Relationship: GetReshipId(),
            RecUser: jwtDecode(token).USRID
        }

        try {
            console.log(data)
            const result = await axios.post('/addRelatives', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    FullName: '',

                    Suffix: '',
                    ContactNo: '',
                    Birthdate: '',
                    WorkEducStatus: '',
                    Relationship: '',
                });
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }

    }


    async function onClickEdit() {


        const row = await form.validateFields();
        getRelationshipList.refetch();
        // getRelativeSuffix.refetch();

        try {
            const data = {
                Code: editingKey,
                Fullname: row.fullName,
                Suffix: row.suffix,
                Contactno: row.contactNo,
                Birthdate: row.birthdate,
                workEducStatus: GetWorkEducStatusId(),  // Use the mapped value
                Relationship: GetReshipId(),
                ModUser: jwtDecode(token).USRID
            };
            //console.log('suffix', data)
            console.log(data)
            const result = await axios.post('/editRelatives', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    FullName: '',
                    Suffix: '',
                    ContactNo: '',
                    Birthdate: '',
                    WorkEducStatus: '',
                    Relationship: '',
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
            const result = await axios.post(`/Relativedelete/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
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
                    <Button className='bg-[#3b0764]' type='primary' disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            const record = { key: 0, fullName: '', suffix: '', contactNo: '', birthdate: '', workEducStatus: '', relationship: '' }
                            edit(record)
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                FullName: '',
                                Suffix: '',
                                ContactNo: '',
                                Birthdate: '',
                                WorkEducStatus: '',
                                Relationship: '',
                            })
                        }} />

                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '4%',
            align: 'center'
        },

        {
            title: 'fullName',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '20%',
            editable: true,
        },
        {
            title: 'suffix',
            dataIndex: 'suffix',
            key: 'suffix',
            width: '6%',
            editable: true,
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNo',
            key: 'contactNo',
            width: '8%',
            editable: true,
        },
        {
            title: 'Age',
            dataIndex: 'birthdate',
            key: 'birthdate',
            width: '6%',
            editable: true,
        },
        {
            title: 'School / Employment',
            dataIndex: 'workEducStatus',
            key: 'workEducStatus',
            width: '17%',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relationship',
            key: 'relationship',
            width: '17%',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '6%',
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
                                    <Button className='bg-[#3b0764]' disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {

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
                                    <Button disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
            }
        },
    ];


    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            fullName: record.fullName,
            suffix: record.suffix,
            contactNo: record.contactNo,
            birthdate: record.birthdate,
            workEducStatus: record.workEducStatus,
            relationship: record.relationship,
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


    async function onChangeToUpper(e, pointer) {
        if (pointer === 'fullName') {
            form.setFieldsValue({ 'fullName': toUpperText(e) });
        } else if (pointer === 'suffix') {
            form.setFieldsValue({ 'suffix': e });
        } else {
            form.setFieldValue({ 'birthdate': e });
        }
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

    async function onChangedropdown(e, pointer) {
        if (pointer === 'workEducStatus') {
            form.setFieldsValue({ 'workEducStatus': e });
        } else {
            form.setFieldsValue({ 'Relationship': e });
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
        const inputNode = dataIndex === 'fullName'
            ? (
                <>

                    <Input
                        className='w-[10rem]'
                        onChange={(e) => { onChangeToUpper(e.target.value, 'fullName'); }}
                        placeholder='First Name' />
                </>
            )
            : dataIndex === 'suffix'
                ? (
                    <>

                        <Input
                            className='w-[10rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'suffix'); }}
                            placeholder='Suffix' />
                    </>
                )
                : dataIndex === 'contactNo'
                    ? (
                        <>
                            <Input
                                className='w-[10rem]'
                                onChange={(e) => onChangeContactNo(e.target.value, 'contactNo')}
                                placeholder='Contact Number'
                                maxLength={11}
                            />
                        </>
                    )
                    : dataIndex === 'birthdate'
                        ? (<>


                            <Input
                                className='w-[10rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'birthdate'); }}
                                placeholder='Age' />

                        </>
                        ) : dataIndex === 'workEducStatus'
                            ? (<>
                                <Select
                                    className='w-[10rem]'
                                    onChange={(value) => { onChangedropdown(value); }}
                                    placeholder="School / Employment"
                                    options={WorkEducStatusOption().map(x => ({
                                        value: x.value,
                                        label: x.label
                                    }))}
                                />

                            </>
                            )
                            : (<>

                                <Select
                                    className='w-[10rem]'
                                    onChange={(value) => { onChangedropdown(value); }}
                                    placeholder='Relationship'
                                    options={getRelationshipList.data?.map(x => ({ value: x.description, label: x.description }))}
                                />

                            </>
                            );

        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={
                    dataIndex === 'contactNo'
                        ? [
                            { required: true, message: `Please input ${title}` },
                            { pattern: /^09\d{9}$/, message: 'Must start with "09" and be 11 digits' }
                        ]
                        : [{ required: true, message: `Please input ${title}` }]
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



    const dataOnly = Array.isArray(getRelatives.data)
        ? getRelatives.data.filter(x => x.key !== 0)
        : [];

    return (
        <div className='h-[300px] flex flex-col items-center'>
            {contextHolder}
            <div className='mt-4 w-[100%]'>
                <center>
                    <SectionHeader title="OFW Dependents" />
                </center>
                <div className='mt-0'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns}
                            dataSource={
                                loading
                                    ? []
                                    : (
                                        getStat === false
                                            ? getRelatives.data?.map((x) => ({
                                                key: x.key,
                                                no: x.no,
                                                fullName: x.FullName,
                                                suffix: x.Suffix,
                                                contactNo: x.ContactNo,
                                                birthdate: x.Birthdate,
                                                workEducStatus: WorkEducStatusOption().find((option) => option.value === x.WorkEducStatus)?.label || x.WorkEducStatus,
                                                relationship: x.Relationship,
                                            }))
                                            : dataOnly?.map((x) => ({
                                                key: x.key,
                                                no: x.no,
                                                fullName: x.FullName,
                                                suffix: x.Suffix,
                                                contactNo: x.ContactNo,
                                                birthdate: x.Birthdate,
                                                workEducStatus: WorkEducStatusOption().find((option) => option.value === x.WorkEducStatus)?.label || x.WorkEducStatus,
                                                relationship: x.Relationship,
                                            }))
                                    )
                            }
                            components={{ body: { cell: EditableCell } }}
                            scroll={{ y: 200, x: '100vw' }}
                            rowClassName='editable-row'
                            pagination={false}
                            loading={{
                                spinning: loading,
                                indicator: <Spin tip="Loading..." />,
                            }}
                        />
                    </Form>

                </div>
            </div>
        </div>
    );
}

export default Relatives;