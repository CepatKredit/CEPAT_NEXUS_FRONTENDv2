import React from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { WorkEducStatusOption } from '@utils/FixedData';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
dayjs.extend(customParseFormat);
import moment from 'moment';
import axios from 'axios';

function Relatives({ BorrowerId, onUpdateCount }) {
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
    const role = GetData('ROLE').toString();
    React.useEffect(() => { getRelatives.refetch() }, [BorrowerId]);

    const getRelatives = useQuery({
        queryKey: ['getRelatives'],
        queryFn: async () => {
            const result = await axios.get(`/getRelatives/${BorrowerId}`);
            console.log("API Result:", result);

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
                const suffix = x.suffix && x.suffix !== 'N/A' ? x.suffix : '';

                const fullNames = `${x.fullName || ''} ${suffix}`.trim();
                //console.log("Key:", x.code); 
                //   console.log("Full Name:", fullName);
                dataList.push({
                    key: x.code,
                    no: i + 1,
                    FullName: x.fullName,
                    Suffix: x.suffix,
                    FullNameSuffix: fullNames,
                    ContactNo: x.contactNo,
                    Birthdate: x.birthdate,
                    WorkEducStatus: x.workEducStatus,
                    Relationship: x.relationship,
                });
            });
            if (onUpdateCount) {
                onUpdateCount(dataList.length);
            }
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

    function GetReshipId() {
        if (!getRelationshipList.data) {
            return null; // or handle appropriately
        }
        const ReshipHolder = getRelationshipList.data.find(
            (x) => x.description === getInfo.Relationship || x.code === getInfo.Relationship
        );
        return ReshipHolder ? ReshipHolder.code : null; // Safely return the code or null
    }

    const [getSuffixList, setSuffixList] = React.useState()
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
        const SuffixHolder = getSuffixList.find(
            (x) => x.description === getInfo.Suffix || x.code === getInfo.Suffix
        );
        return SuffixHolder ? SuffixHolder.code : null; // Safely return the code or null
    }


    function GetWorkEducStatusId() {
        const workEducStatusHolder = WorkEducStatusOption().find(
            (x) => x.label === getInfo.WorkEducStatus || x.value === getInfo.WorkEducStatus
        );
        return workEducStatusHolder ? workEducStatusHolder.value : null;
    }

    const [fieldErrors, setFieldErrors] = React.useState({
        FullName: '',
        ContactNo: '',
        relationship: '',
        suffix: '',
        Birthdate: '',
        WorkEducStatus: '',

    });

    function validateContactNumber(ContactNo) {

        return ContactNo.trim() === '' || /^09\d{9}$/.test(ContactNo);
    }

    function validateFullName(FullName) {
        return FullName.trim() !== '';
    }
    function validateSuffix(suffix) {
        return suffix !== '';
    }

    function validateFullRelationship(relationship) {
        return relationship.trim() !== '';
    }
    function validateFullbdate(Birthdate) {
        return Birthdate !== '';
    }
    function validateWEstatus(WorkEducStatus) {
        return WorkEducStatus !== '';
    }

    function isDateTimeValid(dateStr) {
        return dayjs(dateStr).isValid();
    };

    const [getAddStat, setAddStat] = React.useState(false)


    async function onClickSave() {
        let errors = {};
        if (!validateFullName(getInfo.FullName)) {
            errors.FullName = 'Name is required.';
        }
        if (getInfo.ContactNo.trim() !== '' && !validateContactNumber(getInfo.ContactNo)) {
            errors.ContactNo = 'Contact number should have exactly 11 digits and start with 09.';
        }
        if (!validateFullRelationship(getInfo.Relationship)) {
            errors.relationship = 'Relationship is required.';
        }
        if (!validateFullbdate(getInfo.Birthdate)) {
            errors.Birthdate = 'Birthdate is required.';
        }
        if (!validateWEstatus(getInfo.WorkEducStatus)) {
            errors.WorkEducStatus = 'Work/Educ Status is required.';
        }
        if (!validateSuffix(getInfo.Suffix)) {
            errors.suffix = 'Suffix is required.';
        }



        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }




        setFieldErrors({ ContactNo: '', FullName: '', relationship: '', Birthdate: '', WorkEducStatus: '', Suffix: '' });

        setStat(false);
        const formattedBirthdate = getInfo.Birthdate ? moment(getInfo.Birthdate).format('MM-DD-YYYY') : '';


        const data = {
            BorrowersId: BorrowerId,
            Fullname: getInfo.FullName,
            Suffix: GetSuffixId(),
            Contactno: getInfo.ContactNo,
            Birthdate: formattedBirthdate,
            workEducStatus: getInfo.WorkEducStatus,
            Relationship: GetReshipId(),
            RecUser: jwtDecode(token).USRID
        }
        console.log(data)
        await axios.post('/addRelatives', data)
            .then((result) => {
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
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
                setFocus({
                    name: false,
                    conNum: true,
                    remarks: false,
                });
            })
    }
    async function onClickEdit() {
        let errors = {};
        if (!validateFullName(getInfo.FullName)) {
            errors.FullName = 'Name is required.';
        }

        if (getInfo.ContactNo.trim() !== '' && !validateContactNumber(getInfo.ContactNo)) {
            errors.ContactNo = 'Contact number should have exactly 11 digits and start with 09.';
        }

        if (!validateFullbdate(getInfo.Birthdate)) {
            errors.Birthdate = 'Birthdate is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }



        // Clear errors if validation passes
        setFieldErrors({ ContactNo: '', FullName: '', Birthdate: '' });


        getRelationshipList.refetch();
        getRelativeSuffix.refetch();
        const formattedBirthdate = getInfo.Birthdate ? moment(getInfo.Birthdate).format('MM-DD-YYYY') : '';
        try {
            const data = {
                Code: getInfo.key,
                Fullname: getInfo.FullName,
                Suffix: GetSuffixId(),
                Contactno: getInfo.ContactNo,
                Birthdate: formattedBirthdate,
                workEducStatus: GetWorkEducStatusId(),  // Use the mapped value
                Relationship: GetReshipId(),
                ModUser: jwtDecode(token).USRID
            };

            console.log('Data to be sent to the server:', data);

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
    const calculateAge = (birthdate) => {
        if (!birthdate) return 'No Birthdate';
        const birthMoment = moment(birthdate, "DD-MM-YYYY");
        const today = moment();

        if (!birthMoment.isValid()) return 'Invalid Birthdate';
        const age = today.diff(birthMoment, 'years');

        return `Age: ${age} years`;
    };
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR','APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER','RELEASED'
      ];

    const columns = [
        {
            title: (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                FullName: '',
                                FullNameSuffix: '',
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
            width: '1.5rem',
            align: 'center'
        },

        {
            title: 'Category',
            dataIndex: 'category',
            key: 'fullName',
            width: '6rem',
            editable: true,
        },
        {
            title: 'Make',
            dataIndex: 'make',
            key: 'contactNo',
            width: '6rem',
            editable: true,
        },
        {
            title: 'Year / Model Series',
            dataIndex: 'yearmodel',
            key: 'birthdate',
            width: '6rem',
            editable: true,
           
        },
        {
            title: 'Plate Number',
            dataIndex: 'plateNumber',
            key: 'workEducStatus',
            width: '6rem',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '2.5rem',
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
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            remarks: false,
                                        })
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
                                <Button onClick={() => {
                                    onClickEdit()
                                }} icon={<SaveOutlined />} type='primary' />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            remarks: false,
                                        })
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
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''}  onClick={() => {
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            remarks: false,
                                        })
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
                                    <Button disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
            }
        },
    ];

    const [getFocus, setFocus] = React.useState({
        name: false,
        conNum: true,
        remarks: false,
    })

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        setInfo({
            ...getInfo,
            key: record.key,
            FullName: record.fullName,
            Suffix: record.suffix,
            ContactNo: record.contactNo,
            Birthdate: record.birthdate,
            WorkEducStatus: record.workEducStatus,
            Relationship: record.relationship,
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
        const inputNode = dataIndex === 'relationship'
            ? (<>
                <Select
                    className='w-[100%]'
                    value={getInfo.Relationship || undefined}
                    placeholder='Relationship'
                    options={getRelationshipList.data?.map(x => ({ value: x.description, label: x.description }))}
                    onChange={e => {
                        setInfo(prev => ({ ...prev, Relationship: e }));
                    }}
                />
                {fieldErrors.relationship && (
                    <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.relationship}</div>
                )}
            </>
            )
            : dataIndex === 'category'
                ? (
                    <>
                   
                            <Input
                                className='w-[18.5rem]'
                                value={(getInfo.FullName || '').toUpperCase()}
                                onChange={(e) => {
                                    setInfo(prev => ({ ...prev, FullName: e.target.value.toUpperCase() }));
                                }}
                                placeholder='Category'
                                autoFocus={getFocus.firstName}
                                onClick={() => {
                                    setFocus({
                                        ...getFocus,
                                        firstName: true,
                                        contactNo: false,
                                        remarks: false,

                                        workEducStatus: false,
                                    });
                                }}
                            />
                        {fieldErrors.FullName && (
                            <div className="text-red-500 mt-1 ml-[-12rem] text-[7px] font-bold text-center">{fieldErrors.FullName}</div>
                        )}
                      
                    </>
                )
                : dataIndex === 'make'
                    ? (
                        <>
                            <Input
                                value={getInfo.ContactNo || ''}
                                onChange={e => {
                                    let value = e.target.value.replace(/\D/g, '');

                                    if (!value.startsWith('09')) {
                                        value = '09' + value.slice(2);
                                    }

                                    if (value.length > 11) {
                                        value = value.slice(0, 11);
                                    }
                                    setInfo(prev => ({ ...prev, ContactNo: value }));
                                }}
                                placeholder='Make'
                                autoFocus={getFocus.contactNo}
                                onClick={() => {
                                    setFocus({
                                        ...getFocus,
                                        contactNo: true,
                                        firstName: false,
                                        remarks: false,

                                        workEducStatus: false,
                                    });
                                }}
                            />
                            {fieldErrors.ContactNo && (
                                <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.ContactNo}</div>
                            )}
                        </>
                    )
                    : dataIndex === 'Year / Model'
                        ? (<>
                             <Input
                                className='w-[18.5rem]'
                                value={(getInfo.FullName || '').toUpperCase()}
                                onChange={(e) => {
                                    setInfo(prev => ({ ...prev, FullName: e.target.value.toUpperCase() }));
                                }}
                                placeholder='Year / Model Series'
                                autoFocus={getFocus.firstName}
                                onClick={() => {
                                    setFocus({
                                        ...getFocus,
                                       
                                    });
                                }}
                            />
                            {fieldErrors.Birthdate && (
                                <div className="text-red-500 mt-1 ml-[-1rem] text-[7px] font-bold text-center">{fieldErrors.Birthdate}</div>
                            )}
                        </>
                        )
                        : (<>
                             <Input
                                className='w-[18.5rem]'
                                value={(getInfo.FullName || '').toUpperCase()}
                                onChange={(e) => {
                                    setInfo(prev => ({ ...prev, FullName: e.target.value.toUpperCase() }));
                                }}
                                placeholder='Plate Number'
                                autoFocus={getFocus.firstName}
                                onClick={() => {
                                    setFocus({
                                        ...getFocus,
                                       
                                    });
                                }}
                            />
                            {fieldErrors.WorkEducStatus && (
                                <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.WorkEducStatus}</div>
                            )}
                        </>
                        );

        return (
            <td {...restProps}>
                {editing ? (
                    <>
                        {inputNode}
                    </>
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
        <div className='h-[500px] overflow-y-auto flex flex-col items-center'>
            {contextHolder}
            <div className='mt-4 w-[100%]'>
            <center>
                    <Typography.Title level={3}>Owned Assets of OFW / Seaman</Typography.Title>
                </center>
                <div className='mt-[1%]'>
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
                                    workEducStatus: x.WorkEducStatus,
                                    relationship: x.Relationship,
                                    FullNameSuffix: x.FullNameSuffix,
                                }))
                                : dataOnly?.map((x) => ({
                                    key: x.key,
                                    no: x.no,
                                    fullName: x.FullName,
                                    suffix: x.Suffix,
                                    contactNo: x.ContactNo,
                                    birthdate: x.Birthdate,
                                    workEducStatus: x.WorkEducStatus,
                                    relationship: x.Relationship,
                                    FullNameSuffix: x.FullNameSuffix,
                                }))
                        }
                        components={{ body: { cell: EditableCell } }}
                        scroll={{ y: '95%', x: '100vw' }}
                        rowClassName='editable-row'
                        pagination={false}
                    />

                </div>
            </div>
        </div>
    );
}

export default Relatives;
