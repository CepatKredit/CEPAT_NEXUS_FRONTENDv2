import React from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, Spin, Form } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
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
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function Relatives({ BorrowerId, onUpdateCount, User, data }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const suffixRef = React.useRef();
    const { setCount } = getDependentsCount();
    const saveButtonRef = React.useRef();
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
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
    }, [BorrowerId]);

    const getRelatives = useQuery({
        queryKey: ['getRelatives'],
        queryFn: async () => {
            try {
                const result = await axios.get(`/getRelatives/${BorrowerId}`);
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
                SET_LOADING_INTERNAL('DependentsTABLE', false);
                return dataList;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('PropertiesTABLE', false);
            }
            return null;
        },
        refetchInterval: (data) => {
            data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });

    React.useEffect(() => {
        if (!data.loanIdCode) {
            SET_LOADING_INTERNAL('DependentsTABLE', true)
            getRelatives.refetch();
        }
    }, [data]);


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

    function GetWorkEducStatusId() {
        const workValue = form.getFieldValue('workEducStatus');
        const workEducStatusHolder = WorkEducStatusOption().find(
            (x) => x.label === workValue || x.value === workValue
        );
        return workEducStatusHolder ? workEducStatusHolder.value : null;
    }


    const [getAddStat, setAddStat] = React.useState(false)

    const isViewMode = editingKey === '' && !getAddStat;


    const onClickSaveData = useMutation({
        mutationFn: async (row) => {

            const data = {
                BorrowersId: BorrowerId,
                Fullname: row.fullName,
                Suffix: row.suffix || "",
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
                   // setTimeout(() => {
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
                   // }, 5000);
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
        const row = await form.validateFields();
        setStat(false);
        onClickSaveData.mutate(row);

    }



    const onClickEditData = useMutation ({
        mutationFn: async (row) => {
            try {
                const data = {
                    Code: editingKey,
                    Fullname: row.fullName,
                    Suffix: row.suffix || "",
                    Contactno: row.contactNo,
                    Birthdate: row.birthdate,
                    workEducStatus: GetWorkEducStatusId(),
                    Relationship: GetReshipId(),
                    ModUser: jwtDecode(token).USRID
                };
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
    })

    async function onClickEdit() {


        const row = await form.validateFields();
        getRelationshipList.refetch(row);
        onClickEditData.mutate(row);

     
    }


    const onClickDeleteData = useMutation({
        mutationFn: async (e) => {
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
    })
    async function onClickDelete(e) {
        onClickDeleteData.mutate(e);
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
                            const record = { key: 0, fullName: '', suffix: '', contactNo: '', birthdate: '', workEducStatus: '', relationship: '' };
                            edit(record);
                            setStat(false);
                            setEditingKey(0);
                            setAddStat(!getAddStat);
                            setInfo({
                                ...getInfo,
                                FullName: '',
                                Suffix: '',
                                ContactNo: '',
                                Birthdate: '',
                                WorkEducStatus: '',
                                Relationship: '',
                            });
                        }} />
                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '5%',
            align: 'center'
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '20%',
            editable: true,
            render: (text, record) => (
                isViewMode && record.suffix ? `${text} ${record.suffix}` : text
            ),
        },
        // Conditionally display the Suffix column
        ...(isViewMode ? [] : [{
            title: 'Suffix',
            dataIndex: 'suffix',
            key: 'suffix',
            width: '9%',
            editable: true,
        }]),
        {
            title: 'Contact Number',
            dataIndex: 'contactNo',
            key: 'contactNo',
            width: '14%',
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
            width: '20%',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '9%',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickSave} loading={onClickSaveData.isPending} className='bg-[#2b972d]'/>
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
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickEdit} loading={onClickEditData.isPending} className='bg-[#2b972d]'/>
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
                                    <Button className='bg-[#3b0764]' disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {
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
                                    cancelText="Cancel"
                                >
                                    <Button disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger loading={onClickDeleteData.isPending} />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                }
            }
        }
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

            if (!/^\d*$/.test(value)) return;
            value = value.slice(0, 11);

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
                        className='w-[13rem] ml-[-1rem]'
                        onChange={(e) => { onChangeToUpper(e.target.value, 'fullName'); }}
                        placeholder='Full Name' />
                </>
            )
            : dataIndex === 'suffix'
                ? (
                    <>

                        <Input
                            className='w-[5rem] ml-[-.5rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'suffix'); }}
                            placeholder='Suffix' />
                    </>
                )
                : dataIndex === 'contactNo'
                    ? (
                        <>
                            <Input
                                className='w-[8rem]'
                                onChange={(e) => onChangeContactNo(e.target.value, 'contactNo')}
                                placeholder='Contact Number'
                                maxLength={11}
                            />
                        </>
                    )
                    : dataIndex === 'birthdate'
                        ? (<>


                            <Input
                                className='w-[3rem]'
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
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />

                            </>
                            )
                            : (<>

                                <Select
                                    className='w-[10rem]'
                                    onChange={(value) => { onChangedropdown(value); }}
                                    placeholder='Relationship'
                                    options={getRelationshipList.data?.map(x => ({ value: x.description, label: x.description }))}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onFocus={(e) => e.target.click()}
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
                        : dataIndex === 'suffix'
                            ? [] // No validation for 'suffix'
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
        <div className='flex flex-col items-center'>
            {contextHolder}
            <div className='mt-4 w-[100%] px-2'>
                <center>
                    <SectionHeader title="OFW Dependents" />
                </center>
                <div className='mt-0'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns}
                            dataSource={
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

export default Relatives;